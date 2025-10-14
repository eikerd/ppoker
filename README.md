# Planning Poker 🎰

Casino-themed agile story point estimation tool with real-time collaboration.

## Features

- ✅ Real-time voting with WebSocket
- ✅ Casino-style pixel art interface
- ✅ Sound effects for every action
- ✅ Dealer controls (start round, reveal votes)
- ✅ Vote statistics (avg, median, consensus)
- ✅ LocalStorage for user preferences
- ⚠️ In-memory storage (resets on restart)

## Tech Stack

- **Frontend**: Angular 20 (standalone components)
- **Backend**: NestJS
- **Real-time**: WebSocket (socket.io)
- **Styling**: SCSS with CSS variables
- **Monorepo**: Nx

## Quick Start

### Install Dependencies

```bash
npm install
```

### Run Development Servers

**Option 1: Local development (single machine)**
```bash
# Terminal 1: Backend API
npm run start:api
# Runs on http://localhost:3333

# Terminal 2: Frontend
npm run start:frontend
# Runs on http://localhost:4200
```

**Option 2: Network testing (multiple devices on same network)**
```bash
# Terminal 1: Backend API
npm run start:api
# Runs on http://localhost:3333

# Terminal 2: Frontend (with network access)
npm run start:network
# Runs on http://0.0.0.0:4200
# Access from other devices: http://192.168.42.5:4200
```

Visit http://localhost:4200 (local) or http://YOUR_IP:4200 (network) to start playing!

### Environment Configuration

The app supports three environments:

1. **Development** (default): `localhost` for single-machine testing
2. **Network**: Local IP address for multi-device testing
3. **Production**: Domain-based for deployment

To change the API URL for network testing, update:
```
apps/planning-poker/src/environments/environment.network.ts
```

Replace `192.168.42.5` with your machine's actual IP address.

## How to Play

1. **Create a session** - You become the dealer (host)
2. **Share the session ID** with your team
3. **Wait for players to join**
4. **Dealer starts a voting round**
5. **Each player selects a card** (1, 2, 3, 5, 7)
6. **Dealer reveals votes** - Statistics are calculated
7. **Discuss results and repeat**

## Card Values

- **1-5**: Story point estimates
- **7**: "This story is too big, let's split it"

## Project Structure

```
ppoker/
├── apps/
│   ├── api/                    # NestJS backend
│   │   └── src/
│   │       ├── app/
│   │       │   └── session/    # Session management
│   │       └── main.ts
│   └── planning-poker/         # Angular frontend
│       └── src/
│           ├── app/
│           │   ├── core/       # Services
│           │   └── features/   # Components
│           └── styles.scss
├── libs/
│   └── shared/
│       └── data-access/        # Shared models
└── package.json
```

## Development Commands

### Build Applications
```bash
# Build both apps
npx nx run-many --target=build --projects=api,planning-poker

# Build for production
npx nx run-many --target=build --projects=api,planning-poker --configuration=production
```

### Test Applications
```bash
# Test all
npx nx run-many --target=test --all

# Test specific project
npx nx test api
npx nx test planning-poker
```

### Lint
```bash
npx nx run-many --target=lint --all
```

## API Endpoints

### REST API (http://localhost:3333/api)

- `POST /sessions` - Create new session
- `GET /sessions/:id` - Get session details
- `POST /sessions/:id/rounds` - Start new voting round
- `POST /sessions/:id/reveal` - Reveal votes
- `DELETE /sessions/:id` - Delete session

### WebSocket Events

**Client → Server:**
- `session:join` - Join a session
- `vote:place` - Place a vote
- `round:start` - Start a round (dealer only)
- `round:reveal` - Reveal votes (dealer only)
- `session:leave` - Leave session

**Server → Client:**
- `player:joined` - Player joined notification
- `player:left` - Player left notification
- `vote:placed` - Vote placed (value hidden)
- `round:started` - Round started
- `round:revealed` - Votes revealed with statistics

## Current Limitations (MVP)

- Sessions stored in memory only (resets on server restart)
- No authentication
- No session persistence
- Limited to single server instance
- No database integration

## Future Enhancements

See inline `TODO` comments throughout the codebase for:
- Database integration (PostgreSQL/MySQL)
- Redis pub/sub for scaling
- User authentication
- Session history and analytics
- Mobile-responsive design
- Additional themes

## Architecture Notes

### Frontend
- Standalone components (Angular 18+)
- Reactive services with RxJS
- WebSocket for real-time updates
- LocalStorage for user preferences

### Backend
- Repository pattern (database agnostic)
- REST + WebSocket hybrid
- In-memory storage with TODO markers for migration

### Shared
- TypeScript interfaces in libs/shared/data-access
- Path aliases configured in tsconfig.base.json

## Migration Path

This project is designed to be easily migrated:

**Database Migration:**
1. Replace `SessionRepository` with database implementation
2. Update all `TODO` comments in repository files
3. Add migrations
4. Configure database connection

**Design System Migration:**
1. Map CSS variables to design system tokens
2. Replace custom components
3. Update BEM classes to design system classes

## License

MIT

---

🎰 **Have fun estimating!**

For issues or questions, check the TODO comments in the code for migration notes.
