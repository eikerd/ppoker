import { Controller, Get, Post, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SessionService } from './session.service';

// TODO: Add authentication middleware when integrated with corporate auth
// TODO: Add rate limiting (express-rate-limit) for production
// TODO: Replace in-memory with database repository injection
// TODO: Add pagination query params for GET /sessions

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  // Create new session
  @Post()
  async createSession(
    @Body() body: { dealerName: string; dealerAvatar?: string },
  ) {
    try {
      const session = await this.sessionService.createSession(
        body.dealerName,
        body.dealerAvatar,
      );
      return {
        id: session.id,
        dealerId: session.players[0].id,
        status: session.status,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get session details
  @Get(':id')
  async getSession(@Param('id') id: string) {
    const session = await this.sessionService.getSession(id);
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    return session;
  }

  // Start new voting round
  @Post(':id/rounds')
  async startRound(
    @Param('id') id: string,
    @Body() body: { storyName?: string; storyDescription?: string },
  ) {
    try {
      const round = await this.sessionService.startRound(
        id,
        body.storyName,
        body.storyDescription,
      );
      return round;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  // End current round (reveal votes)
  @Post(':id/reveal')
  async revealVotes(@Param('id') id: string) {
    try {
      const result = await this.sessionService.revealVotes(id);
      return result;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  // Delete session (cleanup)
  @Delete(':id')
  async deleteSession(@Param('id') id: string) {
    try {
      await this.sessionService.deleteSession(id);
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get session list (for admin/debug)
  @Get()
  async getAllSessions() {
    return await this.sessionService.getAllSessions();
  }
}
