import { Vote } from './vote.model';

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
