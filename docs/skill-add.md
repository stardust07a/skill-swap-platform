# Skill Add Function Notes

This document summarizes the SCRUM-12 skill add function task.

## User Story

As a user, I want to add the skills I can teach and the skills I want to learn
to my profile so that the system can suggest suitable matches.

## Implementation Locations

Frontend profile skill UI:

- `client/src/pages/ProfileEditPage.jsx`

Backend profile skill controller:

- `server/src/controllers/profileController.js`

Skill catalog controller:

- `server/src/controllers/skillController.js`

Prisma schema:

- `server/prisma/schema.prisma`

## Skill Types

User skills are stored with two supported types:

- `TEACH`: skills the user can teach
- `LEARN`: skills the user wants to learn

The profile page displays these groups as separate lists.

## Add Existing Skill Flow

1. The user chooses whether the skill is `TEACH` or `LEARN`.
2. The user selects a skill from the existing skill list.
3. The frontend checks whether that skill already exists in the same list.
4. The frontend sends `POST /api/profile/skills`.
5. The backend creates a `UserSkill` relation.
6. The new skill appears in the relevant profile list.

## Add New Skill Flow

1. The user writes a skill name that is not in the list.
2. The frontend trims the skill name before sending it.
3. The frontend checks existing skills case-insensitively for the selected type.
4. The frontend sends `POST /api/skills` when a new catalog skill is needed.
5. The frontend sends `POST /api/profile/skills` to attach that skill to the
   user profile.
6. The new skill appears in the relevant profile list.

## Duplicate Protection

Duplicate skill protection exists in two places:

- Frontend: prevents adding the same selected skill to the same list again.
- Database: `UserSkill` has a unique constraint for `userId`, `skillId`, and
  `type`.

This allows the same skill to appear once under `TEACH` and once under `LEARN`,
but prevents duplicates inside the same list.

## Acceptance Criteria Mapping

### Teaching Skills

- The user can choose teaching skills.
- Added teaching skills are listed on the profile edit page.
- The user can remove an added teaching skill.

### Learning Skills

- The user can choose learning skills.
- Learning skills are shown in a separate list.
- The same skill cannot be added twice to the same list.

### New Skill

- The user can write a new skill that is not in the existing list.
- The new skill is saved to the system and attached to the user profile.
