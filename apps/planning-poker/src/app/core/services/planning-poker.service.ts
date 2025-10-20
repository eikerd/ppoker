import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Session, Player, Round } from '@ppoker/shared/data-access';
import { WebSocketService } from './websocket.service';
import { environment } from '../../../environments/environment';
import { SoundService } from './sound.service';

@Injectable({ providedIn: 'root' })
export class PlanningPokerService {
  private readonly API_URL = environment.apiUrl;
  private http = inject(HttpClient);
  private wsService = inject(WebSocketService);
  private soundService = inject(SoundService);

  // State management (consider NgRx for complex apps)
  private sessionSubject = new BehaviorSubject<Session | null>(null);
  private currentRoundSubject = new BehaviorSubject<Round | null>(null);

  readonly session$ = this.sessionSubject.asObservable();
  readonly currentRound$ = this.currentRoundSubject.asObservable();

  // REST Operations
  createSession(dealerName: string, dealerAvatar?: string): Observable<any> {
    console.log('[PP] createSession ->', { dealerName, dealerAvatar });
    return this.http.post<any>(`${this.API_URL}/sessions`, { dealerName, dealerAvatar });
    // TODO: Swap endpoint for Java backend if needed
    // return this.http.post<Session>('https://corporate-api/planning/sessions', ...)
  }

  getSession(sessionId: string): Observable<Session> {
    console.log('[PP] getSession ->', sessionId);
    return this.http.get<Session>(`${this.API_URL}/sessions/${sessionId}`);
  }

  startRound(sessionId: string, storyName?: string): Observable<Round> {
    console.log('[PP] startRound ->', { sessionId, storyName });
    return this.http.post<Round>(
      `${this.API_URL}/sessions/${sessionId}/rounds`,
      { storyName }
    );
  }

  revealVotes(sessionId: string): Observable<any> {
    console.log('[PP] revealVotes ->', sessionId);
    return this.http.post(`${this.API_URL}/sessions/${sessionId}/reveal`, {});
  }

  // WebSocket Operations
  connectToSession(sessionId: string, player: Player): void {
    // If the configured wsUrl points to localhost, prefer to connect to the host
    // that served the SPA (useful when accessing the app from other devices).
    const wsUrl = environment.wsUrl?.includes('localhost') ? undefined : environment.wsUrl;

    console.log('[PP] connectToSession', { sessionId, player, wsUrlGuess: wsUrl ?? 'use window.location' });

    try {
      this.wsService.connect(wsUrl);
      // Small delay might be needed in some browsers before emitting; still attempt immediately and log
      console.log('[PP] emitting session:join', { sessionId, player });
      this.wsService.emit('session:join', { sessionId, player });
      this.setupEventListeners();
    } catch (err) {
      console.error('[PP] connectToSession failed', err);
    }
  }

  placeVote(sessionId: string, playerId: string, value: number | undefined): void {
    console.log('[PP] placeVote', { sessionId, playerId, value });
    try { this.wsService.emit('vote:place', { sessionId, playerId, value }); } catch (e) { console.error('[PP] placeVote emit failed', e); }
  }

  leaveSession(sessionId: string, playerId: string): void {
    console.log('[PP] leaveSession', { sessionId, playerId });
    try { this.wsService.emit('session:leave', { sessionId, playerId }); } catch (e) { console.error('[PP] leaveSession emit failed', e); }
  }

  emitStartRound(sessionId: string, storyName?: string): void {
    console.log('[PP] emitStartRound', { sessionId, storyName });
    try { this.wsService.emit('round:start', { sessionId, storyName }); } catch (e) { console.error('[PP] emitStartRound failed', e); }
  }

  emitRevealRound(sessionId: string): void {
    console.log('[PP] emitRevealRound', { sessionId });
    try { this.wsService.emit('round:reveal', { sessionId }); } catch (e) { console.error('[PP] emitRevealRound failed', e); }
  }

  disconnect(): void {
    console.log('[PP] disconnect');
    this.wsService.disconnect();
  }

  private setupEventListeners(): void {
    console.log('[PP] setupEventListeners registering');

    this.wsService.on('player:joined', (data) => {
      console.log('[PP] event player:joined', data);
      // Play a doorbell sound when any player joins the session
      try {
        this.soundService.play('doorbell');
      } catch (err) {
        console.warn('[PP] sound play failed', err);
      }
      // Update session state
    });

    this.wsService.on('player:left', (data) => {
      console.log('[PP] event player:left', data);
    });

    this.wsService.on('vote:placed', (data) => {
      console.log('[PP] event vote:placed', data);
      // Show player has voted (value still hidden)
    });

    this.wsService.on('round:started', (data) => {
      console.log('[PP] event round:started', data);
      this.currentRoundSubject.next(data.round);
    });

    this.wsService.on('round:revealed', (data) => {
      console.log('[PP] event round:revealed', data);
      // Update round with revealed votes and statistics
    });

    this.wsService.on('session:updated', (data) => {
      console.log('[PP] event session:updated', data);
      this.sessionSubject.next(data.session);
    });

    this.wsService.on('error', (data) => {
      console.error('[PP] event error', data);
    });
  }

  // TODO: Add HTTP polling fallback if WebSocket unavailable
  // private fallbackToPolling(): void { ... }
}
