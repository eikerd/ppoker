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
