# Skill Swap Platform

A full-stack platform that connects people who want to exchange knowledge and practical skills. Users create profiles, list skills they can teach and want to learn, receive ranked match suggestions, send swap requests, message one another, arrange meetings, and publish reviews.

The repository demonstrates a complete React/Express application with JWT authentication, a Prisma data layer, role-based administration, and a responsive animated interface.

## Core features

- Account registration and JWT-based authentication
- bcrypt password hashing
- Profile completion and profile editing
- Teach/learn skill management
- Ranked, location-aware match suggestions
- Filters for skill, city, and exchange mode
- Direct conversations and message polling
- Incoming and outgoing swap requests
- Multi-state request workflow and meeting-link support
- User ratings and written reviews
- Admin statistics and user management
- Seeded demo environment
- Responsive dark glassmorphism UI with Framer Motion

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, React Router, Axios |
| UI | Tailwind CSS, Framer Motion, Lucide React |
| Backend | Node.js, Express.js |
| Data | Prisma ORM, SQLite |
| Security | JWT, bcryptjs, protected/admin middleware |

## Architecture

```text
skill-swap-platform/
├── client/
│   ├── src/components/       # Shared UI and match/profile components
│   ├── src/context/          # Authentication state
│   ├── src/layouts/          # Authenticated application layout
│   ├── src/pages/            # Landing, auth, profile, matches, chat, requests, admin
│   └── src/services/api.js   # Axios client and token interceptors
├── server/
│   ├── prisma/schema.prisma  # SQLite relational model
│   ├── prisma/seed.js        # Demo users, skills, and interactions
│   └── src/
│       ├── controllers/      # Business logic
│       ├── middleware/       # JWT and admin authorization
│       ├── routes/           # REST API routes
│       └── index.js          # Express entry point
└── docs/                     # Feature and presentation notes
```

## Matching model

Candidates are scored using complementary skills and location signals.

| Signal | Score |
| --- | ---: |
| Candidate teaches something the user wants to learn | +40 |
| User teaches something the candidate wants to learn | +40 |
| Same city | +10 |
| Same district | +10 |
| Mutual exchange is possible | +10 bonus |

The final score is capped at 100. The API sorts matches by score and supports additional query filters.

## Local setup

### Requirements

- Node.js 18 or newer
- npm
- No external database server is required

### 1. Configure the backend

Create `server/.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace-this-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"
CLIENT_URL="http://localhost:5173"
PORT=5000
```

### 2. Install and start the backend

```bash
cd server
npm install
npm run db:setup
npm run dev
```

The API starts at `http://localhost:5000` and Prisma creates `server/prisma/dev.db`.

### 3. Install and start the frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to the backend during development.

## Useful commands

```bash
# Reset and reseed the SQLite database
cd server
npm run db:reset

# Inspect data with Prisma Studio
npx prisma studio

# Build the frontend
cd ../client
npm run build
```

## Demo access

Seed data includes an admin and five user profiles. The demo password is `123456`.

| Role | Email |
| --- | --- |
| Admin | `admin@skillswap.com` |
| User | `ahmet@skillswap.com` |
| User | `selin@skillswap.com` |
| User | `merve@skillswap.com` |
| User | `kerem@skillswap.com` |
| User | `deniz@skillswap.com` |

These credentials are development-only and must never be used in production.

## API overview

| Area | Representative endpoints |
| --- | --- |
| Authentication | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Profile | `GET/PUT /api/profile/me`, profile skill operations |
| Users | `GET /api/users/:id` |
| Skills | `GET/POST /api/skills` |
| Matches | `GET /api/matches?skill=&city=&mode=` |
| Conversations | list/create conversations and read/send messages |
| Requests | list/create requests, change status, attach meeting links |
| Reviews | list a user's reviews and create a review |
| Admin | statistics and user-management endpoints |

Protected requests use `Authorization: Bearer <token>`. The Axios client attaches the stored token and clears expired sessions after a `401` response.

## Domain model

Prisma models cover users, skills, conversations, messages, swap requests, and reviews. Relations preserve the participants and history required for matching, messaging, request state, and reputation.

## Security and current limitations

- SQLite and polling are appropriate for a local/demo deployment, not high-concurrency production traffic.
- The JWT secret must be supplied through environment variables and rotated securely.
- Tokens are kept in browser localStorage; a hardened production version should consider secure HTTP-only cookies.
- Messaging uses periodic polling rather than WebSockets.
- Rate limiting, email verification, password recovery, audit logs, and automated moderation are not implemented.
- The repository does not include a comprehensive integration/end-to-end test suite.
- Demo mode and seeded credentials must be disabled before a real deployment.

## Documentation

The `docs/` directory contains focused notes for registration, login, profile completion, skill management, matching, the dashboard, the database, and presentation/demo mode.

## Author

Built by **Aziz** as a full-stack portfolio project focused on authentication, matching logic, relational data, and end-to-end product flows.
