# Dashboard Viewing Notes

This document summarizes the SCRUM-9 dashboard viewing task and maps the
implemented dashboard screen to the acceptance criteria.

## User Story

As a logged-in user, I want to view my dashboard after signing in so that I can
track my profile status, matches, conversations, requests, and recent activity
on the Skill Swap platform.

## Implementation Locations

Frontend dashboard page:

- `client/src/pages/Dashboard.jsx`

Authentication context:

- `client/src/context/AuthContext.jsx`

Dashboard cards and routes:

- `client/src/components/MatchCard.jsx`
- `client/src/App.jsx`

## Dashboard Data Sources

The dashboard reads the authenticated user from `AuthContext` and loads activity
with these API calls:

- `GET /api/matches`
- `GET /api/conversations`
- `GET /api/requests`

The requests are handled with `Promise.allSettled`, so one failed dashboard
request does not hide the rest of the screen. If any request fails, the
dashboard shows a warning while still rendering available profile information.

## Dashboard Flow

1. The user logs in and is redirected to `/dashboard`.
2. Protected routing prevents unauthenticated access.
3. The dashboard shows the user's name and avatar in the welcome header.
4. Match, conversation, request and pending request counts are displayed.
5. Profile completion is calculated from profile fields and user skills.
6. The user's teaching and learning skills are shown when available.
7. Recommended matches, recent messages and recent requests are listed.
8. Empty sections show clear fallback messages and links where useful.

## Acceptance Criteria Mapping

### Dashboard Content

- The user's name is shown in the welcome header.
- The user's avatar is shown from `avatarUrl`; if it is missing, a DiceBear
  fallback avatar is used.
- Match count is shown with the `Eşleşme` stat card.
- Conversation count is shown with the `Konuşma` stat card.
- Request count is shown with the `Talep` stat card.
- Pending incoming request count is shown with the `Bekleyen` stat card.

### Summary Information

- User skills are listed under `Becerilerim`.
- Teaching skills are listed under `Öğrettiklerim`.
- Learning skills are listed under `Öğrenmek İstediklerim`.
- Recommended matches are shown in the `Önerilen Eşleşmeler` section.
- Recent messages are shown in the `Mesajlar` section.
- Recent requests are shown in the `Son Talepler` section.

### Profile Status

The dashboard calculates a profile completion percentage by checking:

- profile photo
- bio
- city and district
- teaching skills
- learning skills
- availability text
- swap or paid lesson preference

The checklist is displayed in the dashboard header, and the user can go to the
profile edit page with the `Profili tamamla` link.

### Design

- The dashboard uses the existing dark glass design style.
- Stat cards and content sections use the existing responsive Tailwind classes.
- The page supports mobile and desktop layouts with grid classes.
- User-facing Turkish text is corrected so labels and empty states are readable.

## Verification

Frontend build command:

```bash
npm.cmd run build
```

The dashboard build was checked after the SCRUM-9 update.
