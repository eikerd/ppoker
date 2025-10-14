import { Injectable } from '@nestjs/common';
import { Session } from '@ppoker/shared/data-access';

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
