import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

// Use only the actual sound ids that correspond to files in assets/sounds.
type SoundId = 'click' | 'deal' | 'flip' | 'flop' | 'toss' | 'yay';

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
  }

  private initializeFromStorage(): void {
    const prefs = this.storage.getPreferences();
    this.enabled$.next(prefs.soundEnabled);
    this.volume$.next(prefs.volume);
  }

  private preloadSounds(): void {
    // Map sound ids directly to the files under assets/sounds
    const soundFiles: Record<SoundId, string> = {
      click: '/assets/sounds/click.wav',
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

  play(soundId: SoundId): void {
    if (!this.enabled$.value) return;

    const sound = this.sounds[soundId];
    if (!sound) return;

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
