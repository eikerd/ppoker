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
