import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Session, Player, Round } from '@ppoker/shared/data-access';
import { WebSocketService } from './websocket.service';

@Injectable({ providedIn: 'root' })
export class PlanningPokerService {
  private readonly API_URL = 'http://localhost:3333/api';
  private http = inject(HttpClient);
  private wsService = inject(WebSocketService);

  // State management (consider NgRx for complex apps)
  private sessionSubject = new BehaviorSubject<Session | null>(null);
  private currentRoundSubject = new BehaviorSubject<Round | null>(null);

  readonly session$ = this.sessionSubject.asObservable();
  readonly currentRound$ = this.currentRoundSubject.asObservable();

  // REST Operations
  createSession(dealerName: string, dealerAvatar?: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/sessions`, { dealerName, dealerAvatar });
    // TODO: Swap endpoint for Java backend if needed
    // return this.http.post<Session>('https://corporate-api/planning/sessions', ...)
  }

  getSession(sessionId: string): Observable<Session> {
    return this.http.get<Session>(`${this.API_URL}/sessions/${sessionId}`);
  }

  startRound(sessionId: string, storyName?: string): Observable<Round> {
    return this.http.post<Round>(
      `${this.API_URL}/sessions/${sessionId}/rounds`,
      { storyName }
    );
  }

  revealVotes(sessionId: string): Observable<any> {
    return this.http.post(`${this.API_URL}/sessions/${sessionId}/reveal`, {});
  }

  // WebSocket Operations
  connectToSession(sessionId: string, player: Player): void {
    this.wsService.connect();
    this.wsService.emit('session:join', { sessionId, player });
    this.setupEventListeners();
  }

  placeVote(sessionId: string, playerId: string, value: number): void {
    this.wsService.emit('vote:place', { sessionId, playerId, value });
  }

  leaveSession(sessionId: string, playerId: string): void {
    this.wsService.emit('session:leave', { sessionId, playerId });
  }

  emitStartRound(sessionId: string, storyName?: string): void {
    this.wsService.emit('round:start', { sessionId, storyName });
  }

  emitRevealRound(sessionId: string): void {
    this.wsService.emit('round:reveal', { sessionId });
  }

  disconnect(): void {
    this.wsService.disconnect();
  }

  private setupEventListeners(): void {
    this.wsService.on('player:joined', (data) => {
      console.log('Player joined:', data);
      // Update session state
    });

    this.wsService.on('player:left', (data) => {
      console.log('Player left:', data);
    });

    this.wsService.on('vote:placed', (data) => {
      console.log('Vote placed:', data);
      // Show player has voted (value still hidden)
    });

    this.wsService.on('round:started', (data) => {
      console.log('Round started:', data);
      this.currentRoundSubject.next(data.round);
    });

    this.wsService.on('round:revealed', (data) => {
      console.log('Round revealed:', data);
      // Update round with revealed votes and statistics
    });

    this.wsService.on('session:updated', (data) => {
      console.log('Session updated:', data);
      this.sessionSubject.next(data.session);
    });

    this.wsService.on('error', (data) => {
      console.error('WebSocket error:', data);
    });
  }

  // TODO: Add HTTP polling fallback if WebSocket unavailable
  // private fallbackToPolling(): void { ... }
}
