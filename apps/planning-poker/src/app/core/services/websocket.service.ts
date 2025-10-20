import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: Socket | null = null;

  // Build a sensible default URL when none provided so clients served from the
  // frontend can connect to the same host automatically (useful for network testing).
  connect(url?: string): void {
    if (this.socket?.connected) {
      // Avoid accessing private properties on Socket.IO Manager; use any cast for diagnostic logging instead
      const uri = (this.socket as any)?.io?.uri ?? (this.socket as any)?.io?.opts?.path ?? 'unknown';
      console.log('[WS] connect called but socket already connected to', uri);
      return;
    }

    const target = url ?? `${window.location.protocol}//${window.location.hostname}:3333`;

    console.log('[WS] Attempting socket.io connection to', target);

    this.socket = io(target, {
      transports: ['websocket'],
      // TODO: Add auth token when available
      // auth: { token: this.authService.getToken() }
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    this.socket.on('connect', () => console.log('[WS] connected -> id=', this.socket?.id, 'uri=', (this.socket as any)?.io?.uri));
    this.socket.on('connect_error', (err) => console.error('[WS] connect_error', err && (err.message || err)));
    this.socket.on('error', (err) => console.error('[WS] socket error', err));
    this.socket.on('disconnect', (reason) => console.log('[WS] disconnected, reason=', reason));
    this.socket.on('reconnect_attempt', (attempt) => console.log('[WS] reconnect attempt', attempt));
    this.socket.on('reconnect_failed', () => console.warn('[WS] reconnect_failed'));
    this.socket.on('reconnect_error', (err) => console.error('[WS] reconnect_error', err));
    this.socket.on('reconnect', (attempt) => console.log('[WS] reconnected after attempts=', attempt));

    // Listen for any server 'error' events and surface them
    this.socket.on('error', (payload) => console.error('[WS] server error event', payload));
  }

  emit(event: string, data: any): void {
    if (!this.socket) {
      console.warn('[WS] emit called but socket not connected - event=', event, 'data=', data);
      throw new Error('Socket not connected');
    }
    console.log('[WS] emit', event, data);
    this.socket.emit(event, data);
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.socket) {
      console.warn('[WS] on called but socket not connected - event=', event);
      throw new Error('Socket not connected');
    }
    console.log('[WS] registering listener for', event);
    this.socket.on(event, (payload: any) => {
      console.log('[WS] received', event, payload);
      callback(payload);
    });
  }

  disconnect(): void {
    console.log('[WS] disconnect called');
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
