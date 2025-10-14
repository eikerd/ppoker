export interface Vote {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  value?: 1 | 2 | 3 | 5 | 7;    // undefined until placed
  placedAt?: Date;
}

// TODO: Add confidence level field for future feature
// confidence?: 'low' | 'medium' | 'high';
