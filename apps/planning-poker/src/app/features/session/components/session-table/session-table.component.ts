import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
  private router = inject(Router);
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

    // Get player name from localStorage first, then fall back to profile
    const savedName = localStorage.getItem('playerName');

    // Get player profile
    const profile = this.storage.getProfile();
    if (!profile) {
      // Create a new player profile
      const newProfile = {
        id: crypto.randomUUID(),
        name: savedName || 'Player',
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
        name: savedName || profile.name, // Use localStorage name if available
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
          this.setupWebSocketListeners(sessionId);
        }
      },
      error: (err) => {
        console.error('Failed to load session:', err);
        alert('Session not found');
      }
    });
  }

  private setupWebSocketListeners(sessionId: string) {
    // Listen for session updates and sync UI state
    this.pokerService.session$.subscribe((session) => {
      if (session) {
        this.session = session;
        // Update UI state based on session status
        this.isVotingActive = session.status === 'voting';
        this.showResults = session.status === 'revealed';
      }
    });

    // Manually setup socket listeners for real-time updates
    const wsService = (this.pokerService as any).wsService;

    wsService.on('player:joined', (data: any) => {
      console.log('Player joined:', data);
      // Refresh session to get updated player list
      this.pokerService.getSession(sessionId).subscribe((session) => {
        this.session = session;
        this.isVotingActive = session.status === 'voting';
        this.showResults = session.status === 'revealed';
      });
    });

    wsService.on('player:left', (data: any) => {
      console.log('Player left:', data);
      // Refresh session to get updated player list
      this.pokerService.getSession(sessionId).subscribe((session) => {
        this.session = session;
        this.isVotingActive = session.status === 'voting';
        this.showResults = session.status === 'revealed';
      });
    });

    wsService.on('vote:placed', (data: any) => {
      console.log('Vote placed:', data);
      // Refresh session to show vote indicator
      this.pokerService.getSession(sessionId).subscribe((session) => {
        this.session = session;
        this.isVotingActive = session.status === 'voting';
        this.showResults = session.status === 'revealed';
      });
    });

    wsService.on('round:started', (data: any) => {
      console.log('Round started:', data);
      this.soundService.play('button');
      // Refresh session and sync state
      this.pokerService.getSession(sessionId).subscribe((session) => {
        this.session = session;
        this.isVotingActive = session.status === 'voting';
        this.showResults = session.status === 'revealed';
      });
    });

    wsService.on('round:revealed', (data: any) => {
      console.log('Round revealed:', data);
      this.soundService.play('trumpet');
      // Refresh session and sync state
      this.pokerService.getSession(sessionId).subscribe((session) => {
        this.session = session;
        this.isVotingActive = session.status === 'voting';
        this.showResults = session.status === 'revealed';
      });
    });
  }

  ngOnDestroy() {
    this.pokerService.disconnect();
  }

  backToLobby() {
    this.pokerService.disconnect();
    this.router.navigate(['/lobby']);
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

    // If value is -1, it's an unvote - send undefined to clear the vote
    if (value === -1) {
      this.pokerService.placeVote(this.session.id, this.currentPlayer.id, undefined);
    } else {
      this.pokerService.placeVote(this.session.id, this.currentPlayer.id, value);
    }
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
