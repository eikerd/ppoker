import { Injectable } from '@angular/core';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: Date;
}

interface UserPreferences {
  soundEnabled: boolean;
  volume: number;
  animationsEnabled: boolean;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly KEYS = {
    PROFILE: 'ppoker-user-profile',
    PREFERENCES: 'ppoker-user-preferences',
    HISTORY: 'ppoker-session-history'
  };

  // User Profile
  getProfile(): UserProfile | null {
    const data = localStorage.getItem(this.KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  }

  setProfile(profile: UserProfile): void {
    localStorage.setItem(this.KEYS.PROFILE, JSON.stringify(profile));
  }

  // Preferences
  getPreferences(): UserPreferences {
    const data = localStorage.getItem(this.KEYS.PREFERENCES);
    return data ? JSON.parse(data) : {
      soundEnabled: true,
      volume: 70,
      animationsEnabled: true
    };
  }

  setPreferences(prefs: UserPreferences): void {
    localStorage.setItem(this.KEYS.PREFERENCES, JSON.stringify(prefs));
  }

  // Session History
  addToHistory(sessionId: string, sessionName: string, role: 'dealer' | 'player'): void {
    const history = this.getHistory();
    history.unshift({
      id: sessionId,
      name: sessionName,
      lastVisited: new Date(),
      role
    });

    // Keep only last 10
    if (history.length > 10) history.pop();

    localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
  }

  getHistory(): any[] {
    const data = localStorage.getItem(this.KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  }

  clearAll(): void {
    Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
  }
}
