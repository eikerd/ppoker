import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

// Use only the actual sound ids that correspond to files in assets/sounds.
type SoundId = 'click' | 'doorbell' | 'deal' | 'flip' | 'flop' | 'toss' | 'yay';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private sounds: Record<SoundId, HTMLAudioElement> = {} as any;
  private enabled$ = new BehaviorSubject<boolean>(true);
  private volume$ = new BehaviorSubject<number>(70);

  readonly enabled = this.enabled$.asObservable();
  readonly volume = this.volume$.asObservable();

  constructor(private storage: StorageService) {
    this.initializeFromStorage();
    this.preloadSounds();
    // Attempt to unlock audio playback on first user gesture (works around browser autoplay policies)
    this.setupAudioUnlock();
  }

  private initializeFromStorage(): void {
    const prefs = this.storage.getPreferences();
    console.log('prefs: ', prefs);
    this.enabled$.next(prefs.soundEnabled);
    this.volume$.next(prefs.volume);
  }

  private preloadSounds(): void {
    // Map sound ids directly to the files under assets/sounds
    const soundFiles: Record<SoundId, string> = {
      click: '/assets/sounds/click.wav',
      doorbell: '/assets/sounds/doorbell.mp3',
      deal: '/assets/sounds/deal.ogg',
      flip: '/assets/sounds/flip.ogg',
      flop: '/assets/sounds/flop.ogg',
      toss: '/assets/sounds/toss.ogg',
      yay: '/assets/sounds/yay.mp3'
    };

    Object.entries(soundFiles).forEach(([id, url]) => {
      try {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.sounds[id as SoundId] = audio;
      } catch (err) {
        // In case Audio isn't available (server-side rendering), skip gracefully
        // and leave the entry undefined so play() will simply no-op.
        // eslint-disable-next-line no-console
        console.warn(`Failed to create audio for ${id} -> ${url}:`, err);
      }
    });
  }

  private setupAudioUnlock(): void {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      try {
        Object.values(this.sounds).forEach((audio) => {
          if (!audio) return;
          // Try to play muted once to satisfy browser gesture requirement, then pause
          audio.muted = true;
          const p = audio.play();
          if (p && typeof p.then === 'function') {
            p.then(() => {
              audio.pause();
              audio.currentTime = 0;
              audio.muted = false;
            }).catch(() => {
              // ignore play errors here
              audio.muted = false;
            });
          } else {
            audio.muted = false;
          }
        });
      } catch (err) {
        // swallow errors
      } finally {
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('click', unlock);
        window.removeEventListener('touchstart', unlock);
      }
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  play(soundId: SoundId): void {
    if (!this.enabled$.value) return;

    const sound = this.sounds[soundId];
    if (!sound) {
      // eslint-disable-next-line no-console
      console.warn(`[SoundService] sound not loaded: ${soundId}`);
      return;
    }

    sound.volume = this.volume$.value / 100;
    sound.currentTime = 0; // Reset to start
    sound.play().catch(err => console.warn('Sound play failed:', err));
  }

  setEnabled(enabled: boolean): void {
    this.enabled$.next(enabled);
    this.updatePreferences();
  }

  setVolume(volume: number): void {
    this.volume$.next(Math.max(0, Math.min(100, volume)));
    this.updatePreferences();
  }

  private updatePreferences(): void {
    const prefs = this.storage.getPreferences();
    prefs.soundEnabled = this.enabled$.value;
    prefs.volume = this.volume$.value;
    this.storage.setPreferences(prefs);
  }
}
