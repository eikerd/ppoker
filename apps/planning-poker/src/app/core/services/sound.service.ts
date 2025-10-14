import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

type SoundId = 'card-flip' | 'chip-clink' | 'trumpet' | 'button';

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
    const soundFiles: Record<SoundId, string> = {
      'card-flip': '/assets/sounds/card-flip.mp3',
      'chip-clink': '/assets/sounds/chip.mp3',
      'trumpet': '/assets/sounds/trumpet.mp3',
      'button': '/assets/sounds/button.mp3'
    };

    Object.entries(soundFiles).forEach(([id, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.sounds[id as SoundId] = audio;
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
