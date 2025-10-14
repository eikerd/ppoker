import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionService } from './session.service';
import { Player } from '@ppoker/shared/data-access';

// TODO: Add Redis adapter for horizontal scaling
//   import { RedisIoAdapter } from '@nestjs/platform-socket.io';
// TODO: Add authentication via JWT token in socket handshake
// TODO: Rate limit socket events (prevent spam)
// TODO: Consider fallback to Server-Sent Events if WebSocket blocked

@WebSocketGateway({
  cors: {
    origin: '*', // TODO: Configure proper CORS in production
  },
})
export class SessionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly sessionService: SessionService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Client → Server: Join session
  @SubscribeMessage('session:join')
  async handleJoinSession(
    @MessageBody() data: { sessionId: string; player: Player },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const session = await this.sessionService.addPlayer(data.sessionId, data.player);

      // Join socket room
      client.join(data.sessionId);

      // Broadcast to all clients in session
      this.server.to(data.sessionId).emit('player:joined', {
        player: data.player,
        playerCount: session.players.length,
      });

      return { success: true, session };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      client.emit('error', { message, code: 'JOIN_FAILED' });
      return { success: false, error: message };
    }
  }

  // Client → Server: Place vote
  @SubscribeMessage('vote:place')
  async handlePlaceVote(
    @MessageBody() data: { sessionId: string; playerId: string; value: 1 | 2 | 3 | 5 | 7 },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.sessionService.placeVote(data.sessionId, data.playerId, data.value);

      // Notify all clients that player voted (don't reveal value yet!)
      this.server.to(data.sessionId).emit('vote:placed', {
        playerId: data.playerId,
      });

      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      client.emit('error', { message, code: 'VOTE_FAILED' });
      return { success: false, error: message };
    }
  }

  // Client → Server: Leave session
  @SubscribeMessage('session:leave')
  async handleLeaveSession(
    @MessageBody() data: { sessionId: string; playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const session = await this.sessionService.removePlayer(data.sessionId, data.playerId);

      // Leave socket room
      client.leave(data.sessionId);

      // Notify others
      this.server.to(data.sessionId).emit('player:left', {
        playerId: data.playerId,
        playerCount: session.players.length,
      });

      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: message };
    }
  }

  // Client → Server: Start round (dealer only)
  @SubscribeMessage('round:start')
  async handleStartRound(
    @MessageBody() data: { sessionId: string; storyName?: string; storyDescription?: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const round = await this.sessionService.startRound(
        data.sessionId,
        data.storyName,
        data.storyDescription,
      );

      // Broadcast to all clients
      this.server.to(data.sessionId).emit('round:started', { round });

      return { success: true, round };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      client.emit('error', { message, code: 'START_ROUND_FAILED' });
      return { success: false, error: message };
    }
  }

  // Client → Server: Reveal votes (dealer only)
  @SubscribeMessage('round:reveal')
  async handleRevealRound(
    @MessageBody() data: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const result = await this.sessionService.revealVotes(data.sessionId);

      // Broadcast results to all clients
      this.server.to(data.sessionId).emit('round:revealed', {
        votes: result.round.votes,
        stats: result.stats,
      });

      return { success: true, results: result };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      client.emit('error', { message, code: 'REVEAL_FAILED' });
      return { success: false, error: message };
    }
  }
}
