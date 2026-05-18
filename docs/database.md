# Database Schema Notes

This document summarizes the database responsibilities for the Skill Swap
platform. The source of truth is `server/prisma/schema.prisma`.

## Database Stack

- ORM: Prisma
- Database: SQLite
- Database URL: `DATABASE_URL` from the server environment
- Local database file: `server/prisma/dev.db`
- Seed script: `server/prisma/seed.js`

## Core Tables

### User

Stores authentication and account level data.

Important fields:

- `id`: unique cuid primary key
- `name`: user full name
- `email`: unique login email
- `passwordHash`: bcrypt hashed password
- `avatarUrl`: optional profile image URL
- `role`: `USER` by default, can be used for admin accounts
- `createdAt`, `updatedAt`: audit timestamps

Main relations:

- One user has one optional `Profile`
- One user can have many `UserSkill` rows
- One user can send and receive lesson requests
- One user can send messages and reviews

### Profile

Stores personal profile details used for matching and public profile pages.

Important fields:

- `userId`: unique foreign key to `User`
- `bio`: optional user description
- `city`, `district`: location fields for filtering and match scoring
- `hourlyRate`: optional paid lesson price
- `isSwapAvailable`: whether the user accepts skill swap
- `isPaidLessonAvailable`: whether the user accepts paid lessons
- `availabilityText`: free text availability information

`Profile` is deleted automatically when the related user is deleted.

### Skill

Stores the available skill catalog.

Important fields:

- `name`: unique skill name
- `category`: optional grouping such as technology, language, music, art
- `createdAt`: creation timestamp

Skills are connected to users through `UserSkill`.

### UserSkill

Connects users and skills with an intent type.

Important fields:

- `userId`: foreign key to `User`
- `skillId`: foreign key to `Skill`
- `type`: skill direction, such as `TEACH` or `LEARN`

The schema prevents duplicate skill rows for the same user, skill, and type
with `@@unique([userId, skillId, type])`.

## Supporting Tables

### Conversation and Message

`Conversation` stores a two-user chat thread. The unique key
`@@unique([user1Id, user2Id])` prevents duplicated conversation records for the
same ordered user pair.

`Message` stores each message in a conversation with `senderId`, `text`,
`isRead`, and `createdAt`.

### LessonRequest

Stores swap or paid lesson requests between users.

Important fields:

- `senderId`, `receiverId`: request participants
- `type`: request type
- `skillOfferedId`, `skillWantedId`: optional skill references
- `price`: optional paid lesson price
- `status`: `PENDING` by default
- `meetingLink`: optional online meeting URL
- `scheduledAt`: optional scheduled date and time

### Review

Stores one review for a completed lesson request.

Important fields:

- `reviewerId`: user who wrote the review
- `reviewedUserId`: user who received the review
- `lessonRequestId`: unique relation to the reviewed request
- `rating`: numeric rating
- `comment`: optional review text

## Registration Data Flow

The registration feature writes account and profile data in this order:

1. Validate name, email, password, and password confirmation in the client.
2. Hash the password in the backend before saving.
3. Create a `User` row with unique email and hashed password.
4. Create the related `Profile` row for the new user.
5. Return an auth token so the user can continue to the dashboard.

This matches the user story requirement that a successful registration also
creates a basic profile record.

## Prisma Commands

Run these commands from the `server` directory.

```bash
npm install
npx prisma db push
npm run db:seed
```

Useful package scripts:

```bash
npm run db:push
npm run db:seed
npm run db:setup
npm run db:reset
npm run db:studio
```

## Migration Notes

The current project uses Prisma `db push` for the SQLite development database.
This keeps the local database synchronized with `schema.prisma`.

For a formal migration workflow, the equivalent Prisma command is:

```bash
npx prisma migrate dev --name init
```

Use migrations when the team wants versioned schema history. Use `db push` for
quick local synchronization during development.
