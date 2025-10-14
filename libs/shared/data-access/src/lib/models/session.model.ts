import { Player } from './player.model';
import { Round } from './round.model';

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
