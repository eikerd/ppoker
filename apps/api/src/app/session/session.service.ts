import { Injectable } from '@nestjs/common';
import { Session, Player, Round, Vote, VoteStatistics } from '@ppoker/shared/data-access';
import { SessionRepository } from './session.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class SessionService {
  constructor(private readonly repository: SessionRepository) {}

  async createSession(dealerName: string, dealerAvatar?: string): Promise<Session> {
    const dealerId = randomUUID();
    const dealer: Player = {
      id: dealerId,
      name: dealerName,
      avatar: dealerAvatar || '🎩',
      isDealer: true,
      isConnected: true,
      joinedAt: new Date(),
    };

    const session: Session = {
      id: randomUUID(),
      dealerId,
      players: [dealer],
      rounds: [],
      status: 'waiting',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.repository.create(session);
  }

  async getSession(id: string): Promise<Session | null> {
    return await this.repository.findById(id);
  }

  async getAllSessions(): Promise<Session[]> {
    return await this.repository.findAll();
  }

  async addPlayer(sessionId: string, player: Player): Promise<Session> {
    const session = await this.repository.findById(sessionId);
    if (!session) throw new Error('Session not found');

    const playerExists = session.players.find(p => p.id === player.id);
    if (!playerExists) {
      session.players.push({ ...player, joinedAt: new Date(), isConnected: true });
    }

    return await this.repository.update(sessionId, { players: session.players });
  }

  async removePlayer(sessionId: string, playerId: string): Promise<Session> {
    const session = await this.repository.findById(sessionId);
    if (!session) throw new Error('Session not found');

    session.players = session.players.filter(p => p.id !== playerId);

    return await this.repository.update(sessionId, { players: session.players });
  }

  async startRound(sessionId: string, storyName?: string, storyDescription?: string): Promise<Round> {
    const session = await this.repository.findById(sessionId);
    if (!session) throw new Error('Session not found');

    // Initialize votes for all players
    const votes: Vote[] = session.players.map(player => ({
      playerId: player.id,
      playerName: player.name,
      playerAvatar: player.avatar,
      value: undefined,
      placedAt: undefined,
    }));

    const round: Round = {
      id: randomUUID(),
      sessionId,
      storyName,
      storyDescription,
      votes,
      status: 'active',
      startedAt: new Date(),
    };

    session.currentRound = round;
    session.rounds.push(round);
    session.status = 'voting';

    await this.repository.update(sessionId, {
      currentRound: round,
      rounds: session.rounds,
      status: 'voting',
    });

    return round;
  }

  async placeVote(sessionId: string, playerId: string, value: 1 | 2 | 3 | 5 | 7): Promise<Session> {
    const session = await this.repository.findById(sessionId);
    if (!session) throw new Error('Session not found');
    if (!session.currentRound) throw new Error('No active round');

    const vote = session.currentRound.votes.find(v => v.playerId === playerId);
    if (!vote) throw new Error('Player not found in round');

    vote.value = value;
    vote.placedAt = new Date();

    return await this.repository.update(sessionId, {
      currentRound: session.currentRound,
    });
  }

  async revealVotes(sessionId: string): Promise<{ round: Round; stats: VoteStatistics }> {
    const session = await this.repository.findById(sessionId);
    if (!session) throw new Error('Session not found');
    if (!session.currentRound) throw new Error('No active round');

    const round = session.currentRound;
    const values = round.votes
      .filter(v => v.value !== undefined)
      .map(v => v.value as number);

    if (values.length === 0) {
      throw new Error('No votes placed');
    }

    const stats = this.calculateStatistics(values, round.votes);

    round.status = 'revealed';
    round.revealedAt = new Date();
    round.statistics = stats;

    session.status = 'revealed';

    await this.repository.update(sessionId, {
      currentRound: round,
      status: 'revealed',
    });

    return { round, stats };
  }

  private calculateStatistics(values: number[], votes: Vote[]): VoteStatistics {
    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    const average = sum / sorted.length;

    // Median
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];

    // Mode
    const frequency: Record<number, number> = {};
    sorted.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency)
      .filter(key => frequency[Number(key)] === maxFreq)
      .map(Number);
    const mode = modes.length === sorted.length ? sorted[0] : (modes.length === 1 ? modes[0] : modes);

    // Range
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    // Consensus (all within 1 point)
    const consensus = (max - min) <= 1;

    // Outliers (votes >2 points from median)
    const outliers = votes
      .filter(v => v.value !== undefined && Math.abs((v.value as number) - median) > 2)
      .map(v => v.playerId);

    return {
      average: Math.round(average * 10) / 10,
      median,
      mode,
      range: { min, max },
      consensus,
      outliers,
    };
  }

  async deleteSession(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
