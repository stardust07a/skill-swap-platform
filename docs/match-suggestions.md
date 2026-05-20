# Match Suggestions Notes

This document summarizes the SCRUM-13 match suggestions task.

## User Story

As a user, I want to see suggested users based on the skills I teach and the
skills I want to learn so that I can contact suitable people for skill swap.

## Implementation Locations

Backend match algorithm:

- `server/src/controllers/matchController.js`

Frontend match list page:

- `client/src/pages/MatchesPage.jsx`

Match card component:

- `client/src/components/MatchCard.jsx`

## Match Logic

The backend compares the logged-in user with other users.

The score is calculated from:

- whether the other user can teach a skill the current user wants to learn
- whether the other user wants to learn a skill the current user can teach
- whether users are in the same city
- whether users are in the same district
- whether the match is mutual

Users with a match score of `0` are filtered out so the list focuses on actual
recommendations.

## Match Card

Each match card displays:

- user name
- avatar
- city and district when available
- match score
- skills the other user can teach to the current user
- skills the other user wants to learn from the current user
- teaching and learning skill preview
- swap availability
- paid lesson availability or hourly rate

The score is shown with a circular percentage indicator so the user can quickly
understand the match suitability.

## Empty State

When no match is found, the matches page shows an informative empty state. If
filters are active, the user can clear the filters and search again.

## Frontend Filtering

The matches page includes optional frontend controls for:

- skill text
- city
- swap or paid lesson mode

Applied filters are shown as removable filter chips above the result list.

## Acceptance Criteria Mapping

### Match Logic

- The system checks the current user's teaching skills.
- The system checks the current user's learning skills.
- Users with compatible skill data are listed.

### Match Card

- The user's name is shown on the card.
- The user's city information is shown when available.
- Teaching and learning skills are shown.
- Match score and availability information are shown.

### Empty Result

- If no suitable match is found, the user sees an informative message.

## Verification

Frontend build command:

```bash
npm.cmd run build
```
