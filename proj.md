Yes! You want one complete markdown file you can just reference. Here it is:


	# PROJECT_BRIEF.md
	
	# Planning Poker - Complete Project Specification
	
	## Quick Reference for Claude Code
	This file contains the complete specification for building a casino-themed planning poker application. Reference this file when generating the project.
	
	**Command**: `cat PROJECT_BRIEF.md` then ask Claude Code to implement this specification.
	
	---
	
	## Project Context
	- Location: `ppoker/` folder (already git initialized)
	- Build: Nx monorepo with Angular 18 + NestJS
	- Purpose: Agile story point estimation tool for SCRUM teams
	- Style: Casino/poker theme with pixel art aesthetic
	- Storage: In-memory only (MVP/prototype)
	- Target: First commit of the project
	
	---
	
	## Technical Stack
	
	### Core Technologies
	- **Nx Workspace** (monorepo management)
	- **Frontend**: Angular 18 (standalone components preferred)
	- **Backend**: NestJS with REST + WebSockets
	- **Real-time**: `@nestjs/websockets` + `socket.io`
	- **Storage**: In-memory Maps (prototype only)
	
	### Dependency Philosophy
	**Keep minimal for corporate security approval**
	- Required: `@nestjs/websockets`, `socket.io`, `socket.io-client`, `rxjs`
	- Optional: `class-validator`, `class-transformer`
	- **NO**: UI libraries, heavy CSS frameworks, external CDNs
	- **YES**: Vanilla CSS/SCSS with CSS variables
	
	### Future Migration Strategy
	- Database: Unknown (PostgreSQL, MySQL, or Java backend)
	- Design System: Will port to proprietary system later
	- Backend: May swap to Java REST + DAO pattern
	
	**Code accordingly**: Use Repository pattern, add TODO comments, keep CSS modular
	
	---
	
	## Project Structure

ppoker/

├── apps/

│   ├── planning-poker/          # Angular 18 frontend

│   │   ├── src/

│   │   │   ├── app/

│   │   │   │   ├── features/

│   │   │   │   │   └── session/

│   │   │   │   │       ├── session-lobby/      # Create/join

│   │   │   │   │       ├── session-table/      # Main game

│   │   │   │   │       └── components/

│   │   │   │   │           ├── player-card/

│   │   │   │   │           ├── voting-cards/

│   │   │   │   │           └── results-table/

│   │   │   │   └── core/

│   │   │   │       ├── services/

│   │   │   │       └── guards/

│   │   │   └── assets/

│   │   │       ├── sounds/

│   │   │       └── images/

│   │   └── project.json

│   │

│   └── api/                     # NestJS backend

│       ├── src/

│       │   ├── app/

│       │   │   ├── session/

│       │   │   │   ├── session.controller.ts

│       │   │   │   ├── session.service.ts

│       │   │   │   ├── session.repository.ts

│       │   │   │   └── session.gateway.ts

│       │   │   └── app.module.ts

│       │   └── main.ts

│       └── project.json

│

├── libs/

│   └── shared/

│       ├── data-access/

│       │   ├── models/          # Shared TypeScript interfaces

│       │   │   ├── session.model.ts

│       │   │   ├── player.model.ts

│       │   │   ├── round.model.ts

│       │   │   └── vote.model.ts

│       │   └── services/        # Angular HTTP/WebSocket clients

│       ├── ui/                  # Reusable components

│       └── util/                # Pure utility functions

│

├── PROJECT_BRIEF.md             # This file

├── README.md                    # Generated project README

└── package.json


	---
	
	## Core Features
	
	### 1. Session Management
	- Any user can create a session → receives unique session ID
	- Session creator becomes "Dealer" (host privileges)
	- Share session via URL: `http://localhost:4200/session/:id`
	- Sessions stored in-memory (reset on server restart - document this)
	
	### 2. Player Roles
	
	**Dealer (Session Creator)**
	- Start new voting rounds
	- End voting early (if player distracted)
	- Trigger vote reveal
	- Cannot be removed from session
	
	**Players**
	- Join via session ID
	- Place votes (1, 2, 3, 5, 7)
	- View results after reveal
	- Can leave session anytime
	
	### 3. Voting Mechanics
	
	**Card Values**
	- `1, 2, 3, 5`: Standard story points
	- `7`: "Discussion needed" flag (stories should be broken down)
	
	**Voting Flow**
	1. Dealer starts round (optional: add story name/description)
	2. Players select card from hand
	3. Real-time status updates:
	   - **"Thinking"**: Player hasn't voted yet (show thinking emoji/animation)
	   - **"Ready"**: Player voted (show face-down card, value hidden)
	4. Dealer can:
	   - Wait for all votes
	   - End voting early (if someone AFK)
	   - Trigger reveal
	
	**Visual Feedback**
	- Card flip animation on selection
	- Chip "clinking" sound when vote placed
	- Face-down cards for other players (suspense!)
	
	### 4. Reveal & Results
	
	**Dramatic Reveal**
	- Trumpet fanfare sound effect
	- All cards flip simultaneously
	- Smooth animation (300ms card flip)
	
	**Results Table (HTML)**

┌──────────────────────────────────────────┐

│ Planning Poker Results - Story #42       │

├─────────┬────────┬──────┬────────────────┤

│ Player  │ Avatar │ Vote │ Status         │

├─────────┼────────┼──────┼────────────────┤

│ Alice   │ 🎨     │ 3    │ ✓              │

│ Bob     │ 🚀     │ 5    │ ⚠️ Outlier     │

│ Carol   │ 🎯     │ 3    │ ✓              │

│ Dave    │ 🎮     │ 7    │ 🚨 Needs Split │

└─────────┴────────┴──────┴────────────────┘

Statistics:


- Average: 4.5

- Median: 4

- Mode: 3 (2 votes)

- Range: 1-7

- Consensus: ❌ (votes span >2 points)


	**Highlighting Rules**
	- Outliers: Votes >2 points from median (yellow)
	- Vote of 7: Red background + warning icon
	- Consensus reached: Green checkmark if all within 1 point
	
	### 5. Visual Design
	
	**Casino Theme**
	- Background: Green poker felt texture (`#0d5e3a`)
	- Cards: White with black numbers, pixel art style
	- Chips: Red, blue, gold for different actions
	- Table: Rounded corners, subtle shadow
	
	**Pixel Art Style**
	- 8-bit inspired fonts (Press Start 2P or similar)
	- Chunky borders (2-3px solid)
	- Limited color palette (NES/SNES era)
	- Retro UI elements (pixelated buttons)
	
	**Color Palette**
	```css
	:root {
	  --felt-green: #0d5e3a;
	  --felt-green-dark: #094a2a;
	  --chip-red: #c41e3a;
	  --chip-blue: #0047ab;
	  --chip-gold: #ffd700;
	  --card-white: #f8f8f8;
	  --card-shadow: rgba(0, 0, 0, 0.3);
	  --text-dark: #1a1a1a;
	  --text-light: #ffffff;
	  --outline-warning: #ff6b35;
	  --outline-danger: #d32f2f;
	  --consensus-green: #4caf50;
	}

6. Sound Effects


Required Sounds (all <50kb, MP3/OGG)


- card-flip.mp3: Card selection/flip (100-200ms)

- chip-clink.mp3: Vote placed (short click)

- trumpet-fanfare.mp3: Reveal (1-2s celebratory)

- button-click.mp3: Generic UI interaction

- player-join.mp3: Someone joins session (optional)

Sound Service Requirements


- Preload all sounds on app init

- User preference: Enable/disable sounds

- Volume control (0-100%)

- LocalStorage persistence

Implementation


	@Injectable({ providedIn: 'root' })
	export class SoundService {
	  private enabled$ = new BehaviorSubject<boolean>(true);
	  private volume$ = new BehaviorSubject<number>(70);
	  
	  play(soundId: 'card-flip' | 'chip-clink' | 'trumpet' | 'button'): void;
	  setEnabled(enabled: boolean): void;
	  setVolume(volume: number): void; // 0-100
	}

7. LocalStorage Features


User Profile (user-profile key)


	interface UserProfile {
	  id: string;           // UUID, generated on first visit
	  name: string;         // Display name
	  avatar: string;       // Emoji or base64 pixel art (max 5kb)
	  createdAt: Date;
	}

Preferences (user-preferences key)


	interface UserPreferences {
	  soundEnabled: boolean;
	  volume: number;        // 0-100
	  animationsEnabled: boolean;
	  theme: 'classic' | 'neon'; // Future: multiple themes
	}

Session History (session-history key)


	interface SessionHistory {
	  recentSessions: Array<{
	    id: string;
	    name: string;
	    lastVisited: Date;
	    role: 'dealer' | 'player';
	  }>;
	  // Keep last 10 sessions max
	}


---

Backend API Specification

REST Endpoints (session.controller.ts)

	// Create new session
	POST /api/sessions
	Body: { dealerName: string, dealerAvatar?: string }
	Response: { id: string, dealerId: string, status: 'waiting' }
	
	// Get session details
	GET /api/sessions/:id
	Response: Session
	
	// Start new voting round
	POST /api/sessions/:id/rounds
	Body: { storyName?: string, storyDescription?: string }
	Response: Round
	
	// End current round (reveal votes)
	POST /api/sessions/:id/reveal
	Response: { round: Round, stats: Statistics }
	
	// Delete session (cleanup)
	DELETE /api/sessions/:id
	Response: { success: boolean }
	
	// Get session list (for admin/debug)
	GET /api/sessions
	Response: Session[]

TODO Comments in Controller


	// TODO: Add authentication middleware when integrated with corporate auth
	// TODO: Add rate limiting (express-rate-limit) for production
	// TODO: Replace in-memory with database repository injection
	// TODO: Add pagination query params for GET /sessions

WebSocket Events (planning-poker.gateway.ts)


Client → Server


	'session:join'
	Payload: { 
	  sessionId: string, 
	  player: { id: string, name: string, avatar: string } 
	}
	Response: { success: boolean, session: Session }
	
	'vote:place'
	Payload: { sessionId: string, playerId: string, value: 1|2|3|5|7 }
	Response: { success: boolean }
	
	'session:leave'
	Payload: { sessionId: string, playerId: string }
	Response: { success: boolean }
	
	'round:start'  // Dealer only
	Payload: { sessionId: string, storyName?: string }
	Response: { success: boolean, round: Round }
	
	'round:reveal' // Dealer only
	Payload: { sessionId: string }
	Response: { success: boolean, results: Results }

Server → Client (Broadcasts)


	'player:joined'
	Payload: { player: Player, playerCount: number }
	
	'player:left'
	Payload: { playerId: string, playerCount: number }
	
	'vote:placed'
	Payload: { playerId: string } // No value shown yet!
	
	'round:started'
	Payload: { round: Round }
	
	'round:revealed'
	Payload: { 
	  votes: Vote[], 
	  stats: { avg, median, mode, range, consensus: boolean } 
	}
	
	'session:updated'
	Payload: { session: Session } // General state sync
	
	'error'
	Payload: { message: string, code: string }

TODO Comments in Gateway


	// TODO: Add Redis adapter for horizontal scaling
	//   import { RedisIoAdapter } from '@nestjs/platform-socket.io';
	// TODO: Add authentication via JWT token in socket handshake
	// TODO: Rate limit socket events (prevent spam)
	// TODO: Consider fallback to Server-Sent Events if WebSocket blocked

Data Models (libs/shared/data-access/models/)


session.model.ts


	export interface Session {
	  id: string;                    // UUID
	  dealerId: string;              // Player ID of session creator
	  players: Player[];
	  currentRound?: Round;
	  rounds: Round[];               // Round history
	  status: 'waiting' | 'voting' | 'revealed';
	  createdAt: Date;
	  updatedAt: Date;
	}
	
	// TODO: Add database entity annotations when migrating to TypeORM
	// @Entity('sessions')
	// export class SessionEntity { ... }

player.model.ts


	export interface Player {
	  id: string;                    // UUID
	  name: string;                  // Display name (max 50 chars)
	  avatar: string;                // Emoji (single char) or data URI
	  isDealer: boolean;
	  isConnected: boolean;          // WebSocket connection status
	  joinedAt: Date;
	}
	
	// TODO: Link to User entity when auth is implemented
	// userId?: string; // Foreign key to users table

round.model.ts


	export interface Round {
	  id: string;                    // UUID
	  sessionId: string;             // Parent session
	  storyName?: string;            // Optional story title
	  storyDescription?: string;     // Optional description
	  votes: Vote[];
	  status: 'active' | 'revealed' | 'cancelled';
	  startedAt: Date;
	  revealedAt?: Date;
	  statistics?: VoteStatistics;   // Computed on reveal
	}
	
	export interface VoteStatistics {
	  average: number;
	  median: number;
	  mode: number | number[];       // Could be multiple modes
	  range: { min: number, max: number };
	  consensus: boolean;            // All votes within 1 point
	  outliers: string[];            // Player IDs with outlier votes
	}
	
	// TODO: Store round history in separate table for analytics

vote.model.ts


	export interface Vote {
	  playerId: string;
	  playerName: string;
	  playerAvatar: string;
	  value?: 1 | 2 | 3 | 5 | 7;    // undefined until placed
	  placedAt?: Date;
	}
	
	// TODO: Add confidence level field for future feature
	// confidence?: 'low' | 'medium' | 'high';

In-Memory Repository (session.repository.ts)

	import { Injectable } from '@nestjs/common';
	import { Session } from '@shared/data-access/models';
	
	@Injectable()
	export class SessionRepository {
	  // ⚠️ IN-MEMORY STORAGE - RESETS ON SERVER RESTART
	  private sessions = new Map<string, Session>();
	  
	  // TODO: Replace with database repository when infrastructure ready
	  // Example for TypeORM:
	  // constructor(
	  //   @InjectRepository(SessionEntity)
	  //   private readonly repo: Repository<SessionEntity>
	  // ) {}
	  
	  async create(session: Session): Promise<Session> {
	    this.sessions.set(session.id, session);
	    // TODO: return await this.repo.save(session);
	    return session;
	  }
	  
	  async findById(id: string): Promise<Session | null> {
	    return this.sessions.get(id) || null;
	    // TODO: return await this.repo.findOne({ 
	    //   where: { id },
	    //   relations: ['players', 'rounds']
	    // });
	  }
	  
	  async findAll(): Promise<Session[]> {
	    return Array.from(this.sessions.values());
	    // TODO: return await this.repo.find({ order: { createdAt: 'DESC' } });
	  }
	  
	  async update(id: string, data: Partial<Session>): Promise<Session> {
	    const session = this.sessions.get(id);
	    if (!session) throw new Error('Session not found');
	    
	    const updated = { ...session, ...data, updatedAt: new Date() };
	    this.sessions.set(id, updated);
	    // TODO: await this.repo.update(id, data);
	    return updated;
	  }
	  
	  async delete(id: string): Promise<void> {
	    this.sessions.delete(id);
	    // TODO: await this.repo.delete(id);
	  }
	  
	  // Memory management: Clean up old sessions
	  async cleanupStale(olderThanHours: number = 24): Promise<number> {
	    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
	    let count = 0;
	    
	    for (const [id, session] of this.sessions) {
	      if (session.createdAt < cutoff) {
	        this.sessions.delete(id);
	        count++;
	      }
	    }
	    
	    // TODO: For database:
	    // await this.repo.delete({ createdAt: LessThan(cutoff) });
	    
	    return count;
	  }
	}
	
	// TODO: Create separate repositories for Round and Vote when DB available
	// This allows better query optimization and data normalization


---

Frontend Architecture

Service Layer (planning-poker.service.ts)

	import { Injectable } from '@angular/core';
	import { HttpClient } from '@angular/common/http';
	import { BehaviorSubject, Observable } from 'rxjs';
	import { Session, Player, Round, Vote } from '@shared/data-access/models';
	
	@Injectable({ providedIn: 'root' })
	export class PlanningPokerService {
	  private readonly API_URL = '/api';
	  
	  // State management (consider NgRx for complex apps)
	  private sessionSubject = new BehaviorSubject<Session | null>(null);
	  private playersSubject = new BehaviorSubject<Player[]>([]);
	  private currentRoundSubject = new BehaviorSubject<Round | null>(null);
	  
	  readonly session$ = this.sessionSubject.asObservable();
	  readonly players$ = this.playersSubject.asObservable();
	  readonly currentRound$ = this.currentRoundSubject.asObservable();
	  
	  constructor(
	    private http: HttpClient,
	    private wsService: WebSocketService
	  ) {}
	  
	  // REST Operations
	  createSession(dealerName: string): Observable<Session> {
	    return this.http.post<Session>(`${this.API_URL}/sessions`, { dealerName });
	    // TODO: Swap endpoint for Java backend if needed
	    // return this.http.post<Session>('https://corporate-api/planning/sessions', ...)
	  }
	  
	  joinSession(sessionId: string): Observable<Session> {
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
	  
	  placeVote(value: number): void {
	    this.wsService.emit('vote:place', { value });
	  }
	  
	  disconnect(): void {
	    this.wsService.disconnect();
	  }
	  
	  private setupEventListeners(): void {
	    this.wsService.on('player:joined', (data) => {
	      // Update players list
	      const players = this.playersSubject.value;
	      this.playersSubject.next([...players, data.player]);
	    });
	    
	    this.wsService.on('vote:placed', (data) => {
	      // Show player has voted (value still hidden)
	      // Update UI indicator
	    });
	    
	    this.wsService.on('round:revealed', (data) => {
	      // Update round with revealed votes and statistics
	      this.currentRoundSubject.next(data.round);
	    });
	    
	    // ... other event handlers
	  }
	  
	  // TODO: Add HTTP polling fallback if WebSocket unavailable
	  // private fallbackToPolling(): void { ... }
	}

WebSocket Service Wrapper (websocket.service.ts)

	import { Injectable } from '@angular/core';
	import { io, Socket } from 'socket.io-client';
	import { Observable } from 'rxjs';
	
	@Injectable({ providedIn: 'root' })
	export class WebSocketService {
	  private socket: Socket | null = null;
	  
	  connect(url: string = 'http://localhost:3333'): void {
	    if (this.socket?.connected) return;
	    
	    this.socket = io(url, {
	      transports: ['websocket'],
	      // TODO: Add auth token when available
	      // auth: { token: this.authService.getToken() }
	    });
	    
	    this.socket.on('connect', () => console.log('WebSocket connected'));
	    this.socket.on('disconnect', () => console.log('WebSocket disconnected'));
	  }
	  
	  emit(event: string, data: any): void {
	    if (!this.socket) throw new Error('Socket not connected');
	    this.socket.emit(event, data);
	  }
	  
	  on(event: string, callback: (data: any) => void): void {
	    if (!this.socket) throw new Error('Socket not connected');
	    this.socket.on(event, callback);
	  }
	  
	  disconnect(): void {
	    this.socket?.disconnect();
	    this.socket = null;
	  }
	  
	  // Convert socket events to Observable for reactive programming
	  fromEvent<T>(event: string): Observable<T> {
	    return new Observable(subscriber => {
	      this.socket?.on(event, (data: T) => subscriber.next(data));
	      return () => this.socket?.off(event);
	    });
	  }
	}

LocalStorage Service (storage.service.ts)

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

Sound Service (sound.service.ts)

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


---

Component Structure

Session Lobby Component (session-lobby.component.ts)


Purpose: Create new session or join existing one

Template (session-lobby.component.html):


	<div class="lobby-container">
	  <h1 class="pixel-text">Planning Poker</h1>
	  
	  <div class="lobby-card">
	    <h2>Create New Session</h2>
	    <form (ngSubmit)="createSession()">
	      <input 
	        type="text" 
	        [(ngModel)]="playerName" 
	        placeholder="Your name"
	        class="pixel-input"
	      />
	      <button type="submit" class="pixel-button pixel-button--primary">
	        Create Session
	      </button>
	    </form>
	  </div>
	  
	  <div class="lobby-card">
	    <h2>Join Session</h2>
	    <form (ngSubmit)="joinSession()">
	      <input 
	        type="text" 
	        [(ngModel)]="sessionId" 
	        placeholder="Session ID"
	        class="pixel-input"
	      />
	      <button type="submit" class="pixel-button pixel-button--secondary">
	        Join Session
	      </button>
	    </form>
	  </div>
	  
	  <div class="session-history" *ngIf="history.length > 0">
	    <h3>Recent Sessions</h3>
	    <div 
	      *ngFor="let session of history" 
	      class="history-item"
	      (click)="rejoinSession(session.id)"
	    >
	      {{ session.name }} - {{ session.role }}
	    </div>
	  </div>
	</div>

Session Table Component (session-table.component.ts)


Purpose: Main game interface

Template (session-table.component.html):


	<div class="poker-table">
	  <div class="table-header">
	    <h2>Session: {{ session?.id }}</h2>
	    <div class="player-count">{{ players.length }} players</div>
	  </div>
	  
	  <div class="player-zone">
	    <app-player-card 
	      *ngFor="let player of players"
	      [player]="player"
	      [hasVoted]="hasPlayerVoted(player.id)"
	      [isDealer]="player.isDealer"
	    ></app-player-card>
	  </div>
	  
	  <div class="card-area">
	    <app-voting-cards
	      [disabled]="!isVotingActive"
	      (cardSelected)="placeVote($event)"
	    ></app-voting-cards>
	  </div>
	  
	  <div class="dealer-controls" *ngIf="isDealer">
	    <button 
	      (click)="startRound()"
	      [disabled]="isVotingActive"
	      class="pixel-button"
	    >
	      Start Round
	    </button>
	    <button 
	      (click)="revealVotes()"
	      [disabled]="!canReveal"
	      class="pixel-button pixel-button--primary"
	    >
	      Reveal Votes
	    </button>
	  </div>
	  
	  <app-results-table
	    *ngIf="showResults"
	    [votes]="currentRound?.votes"
	    [statistics]="currentRound?.statistics"
	  ></app-results-table>
	</div>

Voting Cards Component (voting-cards.component.html)

	<div class="voting-cards">
	  <div 
	    *ngFor="let value of cardValues"
	    class="card"
	    [class.card--selected]="selectedValue === value"
	    [class.card--disabled]="disabled"
	    (click)="selectCard(value)"
	  >
	    <div class="card__value">{{ value }}</div>
	    <div class="card__suit" *ngIf="value === 7">⚠️</div>
	  </div>
	</div>

Component:


	@Component({
	  selector: 'app-voting-cards',
	  templateUrl: './voting-cards.component.html',
	  styleUrls: ['./voting-cards.component.scss']
	})
	export class VotingCardsComponent {
	  @Input() disabled = false;
	  @Output() cardSelected = new EventEmitter<number>();
	  
	  cardValues = [1, 2, 3, 5, 7];
	  selectedValue: number | null = null;
	  
	  constructor(private soundService: SoundService) {}
	  
	  selectCard(value: number): void {
	    if (this.disabled) return;
	    
	    this.selectedValue = value;
	    this.soundService.play('card-flip');
	    this.cardSelected.emit(value);
	  }
	}

Results Table Component (results-table.component.html)

	<div class="results-container">
	  <h3>Voting Results</h3>
	  
	  <table class="results-table">
	    <thead>
	      <tr>
	        <th>Player</th>
	        <th>Avatar</th>
	        <th>Vote</th>
	        <th>Status</th>
	      </tr>
	    </thead>
	    <tbody>
	      <tr 
	        *ngFor="let vote of votes"
	        [class.outlier]="isOutlier(vote)"
	        [class.needs-split]="vote.value === 7"
	      >
	        <td>{{ vote.playerName }}</td>
	        <td class="avatar">{{ vote.playerAvatar }}</td>
	        <td class="vote-value">{{ vote.value }}</td>
	        <td class="status">
	          <span *ngIf="vote.value === 7" class="warning">🚨 Split Story</span>
	          <span *ngIf="isOutlier(vote)" class="outlier-badge">⚠️ Outlier</span>
	          <span *ngIf="!isOutlier(vote) && vote.value !== 7">✓</span>
	        </td>
	      </tr>
	    </tbody>
	  </table>
	  
	  <div class="statistics">
	    <div class="stat">
	      <span class="stat__label">Average:</span>
	      <span class="stat__value">{{ statistics?.average | number:'1.1-1' }}</span>
	    </div>
	    <div class="stat">
	      <span class="stat__label">Median:</span>
	      <span class="stat__value">{{ statistics?.median }}</span>
	    </div>
	    <div class="stat">
	      <span class="stat__label">Range:</span>
	      <span class="stat__value">
	        {{ statistics?.range.min }}-{{ statistics?.range.max }}
	      </span>
	    </div>
	    <div class="stat" [class.consensus-yes]="statistics?.consensus">
	      <span class="stat__label">Consensus:</span>
	      <span class="stat__value">
	        {{ statistics?.consensus ? '✅ Yes' : '❌ No' }}
	      </span>
	    </div>
	  </div>
	</div>


---

CSS Architecture

Global Styles (styles.scss)

	// CSS Variables for easy design system migration
	:root {
	  // Colors - Casino theme
	  --color-felt-green: #0d5e3a;
	  --color-felt-green-dark: #094a2a;
	  --color-felt-border: #076238;
	  
	  --color-chip-red: #c41e3a;
	  --color-chip-blue: #0047ab;
	  --color-chip-gold: #ffd700;
	  --color-chip-black: #1a1a1a;
	  
	  --color-card-white: #f8f8f8;
	  --color-card-back: #3a5a94;
	  --color-card-shadow: rgba(0, 0, 0, 0.3);
	  
	  --color-text-dark: #1a1a1a;
	  --color-text-light: #ffffff;
	  --color-text-muted: #888888;
	  
	  --color-warning: #ff6b35;
	  --color-danger: #d32f2f;
	  --color-success: #4caf50;
	  
	  // Typography - Pixel art style
	  --font-pixel: 'Press Start 2P', 'Courier New', monospace;
	  --font-display: 'VT323', monospace; // Lighter pixel font
	  --font-base: system-ui, sans-serif;
	  
	  // Spacing
	  --spacing-xs: 4px;
	  --spacing-sm: 8px;
	  --spacing-md: 16px;
	  --spacing-lg: 24px;
	  --spacing-xl: 32px;
	  
	  // Dimensions
	  --card-width: 80px;
	  --card-height: 120px;
	  --card-radius: 8px;
	  
	  --button-height: 48px;
	  --input-height: 40px;
	  
	  // Animations
	  --transition-fast: 150ms ease;
	  --transition-normal: 300ms ease;
	  --transition-slow: 500ms ease;
	}
	
	// TODO: Replace these variables with design system tokens when migrating
	// Example: var(--color-felt-green) → var(--ds-color-primary-500)
	
	// Reset and base styles
	* {
	  margin: 0;
	  padding: 0;
	  box-sizing: border-box;
	}
	
	body {
	  font-family: var(--font-base);
	  background: linear-gradient(
	    135deg,
	    var(--color-felt-green-dark) 0%,
	    var(--color-felt-green) 100%
	  );
	  color: var(--color-text-light);
	  min-height: 100vh;
	}
	
	// Utility classes (keep for easy extraction)
	.pixel-text {
	  font-family: var(--font-pixel);
	  text-transform: uppercase;
	  letter-spacing: 2px;
	}
	
	.display-text {
	  font-family: var(--font-display);
	  font-size: 24px;
	}
	
	// TODO: Convert to design system utility classes

Component Styles (BEM methodology)


session-lobby.component.scss


	.lobby-container {
	  max-width: 600px;
	  margin: var(--spacing-xl) auto;
	  padding: var(--spacing-lg);
	}
	
	.lobby-card {
	  background: rgba(255, 255, 255, 0.1);
	  border: 3px solid var(--color-felt-border);
	  border-radius: var(--card-radius);
	  padding: var(--spacing-lg);
	  margin-bottom: var(--spacing-lg);
	  
	  &:hover {
	    background: rgba(255, 255, 255, 0.15);
	  }
	}
	
	.pixel-input {
	  width: 100%;
	  height: var(--input-height);
	  padding: var(--spacing-sm) var(--spacing-md);
	  border: 2px solid var(--color-card-white);
	  background: rgba(0, 0, 0, 0.3);
	  color: var(--color-text-light);
	  font-family: var(--font-display);
	  font-size: 16px;
	  
	  &::placeholder {
	    color: var(--color-text-muted);
	  }
	  
	  &:focus {
	    outline: none;
	    border-color: var(--color-chip-gold);
	    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
	  }
	}
	
	.pixel-button {
	  height: var(--button-height);
	  padding: 0 var(--spacing-lg);
	  border: 3px solid var(--color-text-light);
	  background: var(--color-chip-black);
	  color: var(--color-text-light);
	  font-family: var(--font-pixel);
	  font-size: 12px;
	  cursor: pointer;
	  transition: all var(--transition-fast);
	  
	  &:hover {
	    transform: translateY(-2px);
	    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	  }
	  
	  &:active {
	    transform: translateY(0);
	  }
	  
	  &--primary {
	    background: var(--color-chip-red);
	    border-color: darken(#c41e3a, 10%);
	  }
	  
	  &--secondary {
	    background: var(--color-chip-blue);
	    border-color: darken(#0047ab, 10%);
	  }
	  
	  &:disabled {
	    opacity: 0.5;
	    cursor: not-allowed;
	  }
	}
	
	// TODO: Extract button styles to shared UI component when migrating

voting-cards.component.scss


	.voting-cards {
	  display: flex;
	  gap: var(--spacing-md);
	  justify-content: center;
	  padding: var(--spacing-lg);
	}
	
	.card {
	  width: var(--card-width);
	  height: var(--card-height);
	  background: var(--color-card-white);
	  border: 3px solid var(--color-text-dark);
	  border-radius: var(--card-radius);
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  cursor: pointer;
	  transition: all var(--transition-normal);
	  position: relative;
	  
	  &:hover {
	    transform: translateY(-10px) rotate(2deg);
	    box-shadow: 0 8px 16px var(--color-card-shadow);
	  }
	  
	  &--selected {
	    border-color: var(--color-chip-gold);
	    background: lighten(#ffd700, 40%);
	    transform: translateY(-15px);
	  }
	  
	  &--disabled {
	    opacity: 0.5;
	    cursor: not-allowed;
	    
	    &:hover {
	      transform: none;
	    }
	  }
	  
	  &__value {
	    font-family: var(--font-pixel);
	    font-size: 48px;
	    color: var(--color-text-dark);
	  }
	  
	  &__suit {
	    font-size: 24px;
	    position: absolute;
	    bottom: var(--spacing-sm);
	  }
	}
	
	// Card flip animation
	@keyframes cardFlip {
	  0% {
	    transform: rotateY(0deg);
	  }
	  50% {
	    transform: rotateY(90deg);
	  }
	  100% {
	    transform: rotateY(0deg);
	  }
	}
	
	.card--animating {
	  animation: cardFlip var(--transition-normal);
	}

poker-table.component.scss


	.poker-table {
	  width: 90vw;
	  max-width: 1200px;
	  margin: var(--spacing-xl) auto;
	  padding: var(--spacing-xl);
	  background: var(--color-felt-green);
	  border: 8px solid var(--color-felt-border);
	  border-radius: 50% / 20%;
	  box-shadow: 
	    inset 0 0 50px rgba(0, 0, 0, 0.3),
	    0 10px 30px rgba(0, 0, 0, 0.5);
	  
	  &__header {
	    text-align: center;
	    margin-bottom: var(--spacing-lg);
	  }
	  
	  &__player-zone {
	    display: grid;
	    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	    gap: var(--spacing-md);
	    margin-bottom: var(--spacing-xl);
	  }
	  
	  &__card-area {
	    margin: var(--spacing-xl) 0;
	  }
	}
	
	.player-card {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  gap: var(--spacing-sm);
	  padding: var(--spacing-md);
	  background: rgba(0, 0, 0, 0.2);
	  border: 2px solid rgba(255, 255, 255, 0.1);
	  border-radius: var(--card-radius);
	  
	  &--dealer {
	    border-color: var(--color-chip-gold);
	    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
	  }
	  
	  &__avatar {
	    font-size: 48px;
	  }
	  
	  &__name {
	    font-family: var(--font-display);
	    font-size: 16px;
	  }
	  
	  &__status {
	    font-size: 12px;
	    padding: 4px 8px;
	    border-radius: 4px;
	    
	    &--thinking {
	      background: rgba(255, 255, 255, 0.1);
	    }
	    
	    &--ready {
	      background: var(--color-chip-blue);
	    }
	  }
	}

results-table.component.scss


	.results-container {
	  background: rgba(0, 0, 0, 0.3);
	  border: 3px solid var(--color-chip-gold);
	  border-radius: var(--card-radius);
	  padding: var(--spacing-lg);
	  margin-top: var(--spacing-xl);
	}
	
	.results-table {
	  width: 100%;
	  border-collapse: collapse;
	  font-family: var(--font-display);
	  
	  thead {
	    background: rgba(0, 0, 0, 0.3);
	    
	    th {
	      padding: var(--spacing-md);
	      text-align: left;
	      border-bottom: 2px solid var(--color-chip-gold);
	    }
	  }
	  
	  tbody {
	    tr {
	      transition: background var(--transition-fast);
	      
	      &:hover {
	        background: rgba(255, 255, 255, 0.05);
	      }
	      
	      &.outlier {
	        background: rgba(255, 107, 53, 0.2);
	      }
	      
	      &.needs-split {
	        background: rgba(211, 47, 47, 0.3);
	      }
	    }
	    
	    td {
	      padding: var(--spacing-md);
	      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	      
	      &.avatar {
	        font-size: 24px;
	        text-align: center;
	      }
	      
	      &.vote-value {
	        font-size: 32px;
	        font-family: var(--font-pixel);
	        text-align: center;
	      }
	    }
	  }
	}
	
	.statistics {
	  display: grid;
	  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	  gap: var(--spacing-md);
	  margin-top: var(--spacing-lg);
	}
	
	.stat {
	  background: rgba(0, 0, 0, 0.3);
	  padding: var(--spacing-md);
	  border-radius: var(--card-radius);
	  text-align: center;
	  
	  &__label {
	    display: block;
	    font-size: 12px;
	    color: var(--color-text-muted);
	    margin-bottom: var(--spacing-xs);
	  }
	  
	  &__value {
	    display: block;
	    font-family: var(--font-pixel);
	    font-size: 24px;
	    color: var(--color-chip-gold);
	  }
	  
	  &.consensus-yes {
	    border: 2px solid var(--color-success);
	    
	    .stat__value {
	      color: var(--color-success);
	    }
	  }
	}


---

Development Guide

Initial Setup Commands

	# Create Nx workspace (Angular + NestJS preset)
	npx create-nx-workspace@latest ppoker --preset=angular-nest --appName=planning-poker --style=scss
	
	cd ppoker
	
	# Install dependencies
	npm install @nestjs/websockets @nestjs/platform-socket.io socket.io socket.io-client
	
	# Optional: validation
	npm install class-validator class-transformer
	
	# Generate shared library
	nx g @nx/js:library shared/data-access --directory=libs/shared/data-access
	nx g @nx/angular:library shared/ui --directory=libs/shared/ui
	nx g @nx/js:library shared/util --directory=libs/shared/util
	
	# Generate backend resources
	nx g @nestjs/schematics:resource session --project=api --no-spec
	
	# Generate Angular components
	nx g @angular/schematics:component features/session/session-lobby --project=planning-poker
	nx g @angular/schematics:component features/session/session-table --project=planning-poker
	nx g @angular/schematics:component features/session/components/voting-cards --project=planning-poker
	nx g @angular/schematics:component features/session/components/results-table --project=planning-poker
	nx g @angular/schematics:component features/session/components/player-card --project=planning-poker
	
	# Generate services
	nx g @angular/schematics:service core/services/planning-poker --project=planning-poker
	nx g @angular/schematics:service core/services/websocket --project=planning-poker
	nx g @angular/schematics:service core/services/sound --project=planning-poker
	nx g @angular/schematics:service core/services/storage --project=planning-poker

Running Development Servers

	# Terminal 1: Backend
	nx serve api
	# Runs on http://localhost:3333
	
	# Terminal 2: Frontend
	nx serve planning-poker
	# Runs on http://localhost:4200
	
	# Both together
	nx run-many --target=serve --projects=api,planning-poker

Build for Production

	# Build both apps
	nx run-many --target=build --projects=api,planning-poker --configuration=production
	
	# Output:
	# - dist/apps/api/
	# - dist/apps/planning-poker/


---

Testing Strategy

Unit Tests

	# Test all
	nx run-many --target=test --all
	
	# Test specific project
	nx test api
	nx test planning-poker

E2E Tests (Playwright/Cypress)

	nx e2e planning-poker-e2e

Key scenarios to test:


1. Create session → join with multiple players

2. Place votes → verify hidden from other players

3. Reveal → verify correct statistics calculated

4. WebSocket disconnect/reconnect

5. LocalStorage persistence


---

Deployment Considerations

Docker (Optional)


Dockerfile.api


	FROM node:20-alpine
	WORKDIR /app
	COPY dist/apps/api .
	COPY package*.json .
	RUN npm ci --production
	EXPOSE 3333
	CMD ["node", "main.js"]
	
	# TODO: Add environment variables for database connection
	# ENV DATABASE_URL=postgresql://...

Dockerfile.frontend


	FROM nginx:alpine
	COPY dist/apps/planning-poker /usr/share/nginx/html
	COPY nginx.conf /etc/nginx/conf.d/default.conf
	EXPOSE 80

Environment Variables


api/.env


	PORT=3333
	NODE_ENV=production
	# TODO: Add when database ready
	# DATABASE_URL=postgresql://user:pass@host:5432/dbname
	# REDIS_URL=redis://localhost:6379


---

Migration Checklist

When Database is Available

-  Choose ORM (TypeORM, Prisma, or Java DAO)

-  Create entity classes/schemas

-  Replace SessionRepository implementation

-  Add migrations

-  Update all TODO comments in repository files

-  Test data persistence across restarts

When Design System is Available

-  Map CSS variables to design tokens

-  Replace custom components with design system components

-  Update BEM classes to design system classes

-  Extract and document CSS architecture

-  Update component library imports

Security Hardening for Production

-  Add authentication/authorization

-  Implement rate limiting

-  Add CORS configuration

-  Enable HTTPS/WSS

-  Add input validation on all endpoints

-  Run npm audit and fix vulnerabilities

-  Add Content Security Policy headers

-  Implement session expiration


---

README.md (Generated)

	# Planning Poker 🎰
	
	Casino-themed agile story point estimation tool with real-time collaboration.
	
	## Features
	- ✅ Real-time voting with WebSocket
	- ✅ Casino-style pixel art interface
	- ✅ Sound effects for every action
	- ✅ Dealer controls (start round, reveal votes)
	- ✅ Vote statistics (avg, median, consensus)
	- ✅ LocalStorage for user preferences
	- ⚠️ In-memory storage (resets on restart)
	
	## Tech Stack
	- Angular 18
	- NestJS
	- WebSocket (socket.io)
	- SCSS with CSS variables
	- Nx monorepo
	
	## Quick Start
	
	\`\`\`bash
	npm install
	nx serve planning-poker  # http://localhost:4200
	nx serve api             # http://localhost:3333
	\`\`\`
	
	## How to Play
	
	1. Create a session (you become the dealer)
	2. Share the session ID with your team
	3. Wait for players to join
	4. Dealer starts a voting round
	5. Each player selects a card (1, 2, 3, 5, 7)
	6. Dealer reveals votes
	7. Discuss results and repeat
	
	## Card Values
	- **1-5**: Story point estimates
	- **7**: "This story is too big, let's split it"
	
	## Development
	
	### Generate Components
	\`\`\`bash
	nx g component my-component --project=planning-poker
	\`\`\`
	
	### Run Tests
	\`\`\`bash
	nx test planning-poker
	nx test api
	\`\`\`
	
	### Build
	\`\`\`bash
	nx build planning-poker --configuration=production
	nx build api --configuration=production
	\`\`\`
	
	## Current Limitations (MVP)
	- Sessions stored in memory only
	- No authentication
	- No session persistence
	- Limited to single server instance
	
	## Future Enhancements
	See inline `TODO` comments for:
	- Database integration (PostgreSQL/MySQL)
	- Redis pub/sub for scaling
	- User authentication
	- Session history and analytics
	- Mobile-responsive design
	- Additional themes
	
	## Architecture Notes
	
	### Frontend
	- Facade pattern for services (easy backend swap)
	- BEM CSS methodology (design system ready)
	- WebSocket with HTTP fallback capability
	
	### Backend
	- Repository pattern (database agnostic)
	- REST + WebSocket hybrid
	- In-memory storage with TODO markers
	
	## License
	MIT


---

Final Checklist


Before generating code, ensure:


-  Nx workspace initialized with Angular 18 + NestJS

-  Minimal dependencies only (socket.io, rxjs, core libraries)

-  Repository pattern with in-memory implementation

-  All TODO comments for future database migration

-  Facade pattern in Angular services

-  Modular CSS with CSS variables (design system ready)

-  Sound service with preloading

-  LocalStorage utilities

-  WebSocket gateway with event handlers

-  REST controllers for session management

-  Shared data models in libs/

-  Component structure (lobby, table, cards, results)

-  README with clear migration notes

-  .gitignore configured for node_modules, dist, .env