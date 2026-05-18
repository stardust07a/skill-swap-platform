# Dashboard Viewing Notes

This document summarizes the SCRUM-9 dashboard viewing task and maps the
implemented dashboard screen to the acceptance criteria.

## User Story

As a logged-in user, I want to view my dashboard after signing in so that I can
track my profile status, matches, conversations, requests, and recent activity
on the Skill Swap platform.

## Dashboard Data Sources

The dashboard page is implemented in `client/src/pages/Dashboard.jsx`.

It reads the authenticated user from `AuthContext` and loads dashboard activity
with these API calls:

- `GET /api/matches`
- `GET /api/conversations`
- `GET /api/requests`

The authenticated user data comes from `GET /api/auth/me`, which includes:

- user id, name, email, role, avatar URL
- profile information
- user skills with related skill names

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

Missing profile fields are displayed under `Eksik Alanlar`, and the user can go
to the profile edit page with the `Profili tamamla` link.

### Design

- The dashboard uses the existing dark glass design style.
- Stat cards and content sections use the existing responsive Tailwind classes.
- The page supports mobile and desktop layouts with grid classes.

## Verification

Frontend build command:

```bash
npm run build
```

The dashboard build was checked after the SCRUM-9 update.
