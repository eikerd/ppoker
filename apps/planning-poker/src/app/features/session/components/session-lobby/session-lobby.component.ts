import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanningPokerService } from '../../../../core/services/planning-poker.service';
import { StorageService } from '../../../../core/services/storage.service';
import { SoundService } from '../../../../core/services/sound.service';

@Component({
  selector: 'app-session-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './session-lobby.component.html',
  styleUrls: ['./session-lobby.component.scss']
})
export class SessionLobbyComponent {
  private pokerService = inject(PlanningPokerService);
  private storage = inject(StorageService);
  private soundService = inject(SoundService);
  private router = inject(Router);

  playerName = '';
  sessionId = '';
  history: any[] = [];

  ngOnInit() {
    this.history = this.storage.getHistory();
    const profile = this.storage.getProfile();
    if (profile) {
      this.playerName = profile.name;
    }
  }

  createSession() {
    if (!this.playerName.trim()) return;

    this.soundService.play('button');

    this.pokerService.createSession(this.playerName, '🎩').subscribe({
      next: (response) => {
        // Save profile
        this.storage.setProfile({
          id: response.dealerId,
          name: this.playerName,
          avatar: '🎩',
          createdAt: new Date()
        });

        // Add to history
        this.storage.addToHistory(response.id, `${this.playerName}'s Session`, 'dealer');

        // Navigate to session
        this.router.navigate(['/session', response.id]);
      },
      error: (err) => {
        console.error('Failed to create session:', err);
        alert('Failed to create session');
      }
    });
  }

  joinSession() {
    if (!this.sessionId.trim() || !this.playerName.trim()) return;

    this.soundService.play('button');

    // Navigate to session
    this.router.navigate(['/session', this.sessionId]);
  }

  rejoinSession(sessionId: string) {
    this.sessionId = sessionId;
    this.joinSession();
  }
}
