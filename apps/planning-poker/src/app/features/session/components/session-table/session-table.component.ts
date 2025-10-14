import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Session, Player } from '@ppoker/shared/data-access';
import { PlanningPokerService } from '../../../../core/services/planning-poker.service';
import { StorageService } from '../../../../core/services/storage.service';
import { SoundService } from '../../../../core/services/sound.service';
import { VotingCardsComponent } from '../voting-cards/voting-cards.component';
import { PlayerCardComponent } from '../player-card/player-card.component';
import { ResultsTableComponent } from '../results-table/results-table.component';

@Component({
  selector: 'app-session-table',
  standalone: true,
  imports: [CommonModule, VotingCardsComponent, PlayerCardComponent, ResultsTableComponent],
  templateUrl: './session-table.component.html',
  styleUrls: ['./session-table.component.scss']
})
export class SessionTableComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private pokerService = inject(PlanningPokerService);
  private storage = inject(StorageService);
  private soundService = inject(SoundService);

  session: Session | null = null;
  currentPlayer: Player | null = null;
  isDealer = false;
  isVotingActive = false;
  showResults = false;

  ngOnInit() {
    const sessionId = this.route.snapshot.paramMap.get('id');
    if (!sessionId) return;

    // Get player profile
    const profile = this.storage.getProfile();
    if (!profile) {
      // Create a new player profile
      const newProfile = {
        id: crypto.randomUUID(),
        name: 'Player',
        avatar: '👤',
        createdAt: new Date()
      };
      this.storage.setProfile(newProfile);
      this.currentPlayer = {
        ...newProfile,
        isDealer: false,
        isConnected: true,
        joinedAt: new Date()
      };
    } else {
      this.currentPlayer = {
        ...profile,
        isDealer: false,
        isConnected: true,
        joinedAt: new Date()
      };
    }

    // Load session data
    this.pokerService.getSession(sessionId).subscribe({
      next: (session) => {
        this.session = session;
        this.isDealer = session.dealerId === this.currentPlayer?.id;
        this.isVotingActive = session.status === 'voting';
        this.showResults = session.status === 'revealed';

        // Connect via WebSocket
        if (this.currentPlayer) {
          this.pokerService.connectToSession(sessionId, this.currentPlayer);
        }
      },
      error: (err) => {
        console.error('Failed to load session:', err);
        alert('Session not found');
      }
    });
  }

  ngOnDestroy() {
    this.pokerService.disconnect();
  }

  startRound() {
    if (!this.session) return;

    this.soundService.play('button');
    this.pokerService.emitStartRound(this.session.id);
    this.isVotingActive = true;
    this.showResults = false;
  }

  placeVote(value: number) {
    if (!this.session || !this.currentPlayer) return;

    this.soundService.play('chip-clink');
    this.pokerService.placeVote(this.session.id, this.currentPlayer.id, value);
  }

  revealVotes() {
    if (!this.session) return;

    this.soundService.play('trumpet');
    this.pokerService.emitRevealRound(this.session.id);
    this.isVotingActive = false;
    this.showResults = true;
  }

  hasPlayerVoted(playerId: string): boolean {
    if (!this.session?.currentRound) return false;
    const vote = this.session.currentRound.votes.find(v => v.playerId === playerId);
    return vote?.value !== undefined;
  }

  get canReveal(): boolean {
    if (!this.isDealer || !this.session?.currentRound) return false;
    return this.session.currentRound.votes.some(v => v.value !== undefined);
  }
}
