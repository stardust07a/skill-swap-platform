# Presentation Demo Mode Notes

This document summarizes the SCRUM-14 presentation demo mode task.

## User Story

As a Product Owner, I want only selected pages to be visible during the
presentation so that the project flow can be demonstrated in a controlled way
and unfinished sections can be hidden.

## Implementation Location

Demo mode is configured in:

- `client/src/config/demoMode.js`

Route access is controlled in:

- `client/src/App.jsx`

Navbar visibility is controlled in:

- `client/src/components/Navbar.jsx`

## Demo Mode Flag

Presentation demo mode is enabled by default.

To disable it locally, set:

```bash
VITE_PRESENTATION_DEMO_MODE=false
```

## Visible Pages

When presentation demo mode is enabled, the main visible flow is:

- landing page
- register page
- dashboard page

The authenticated navbar only shows the dashboard link.

## Disabled Pages

When presentation demo mode is enabled, these pages are redirected to the
dashboard:

- matches
- user detail pages
- messages
- requests
- reviews
- admin panel
- profile edit page

## Acceptance Criteria Mapping

### Visible Pages

- Landing page remains accessible.
- Signup/register page remains accessible.
- Dashboard page remains accessible for logged-in users.

### Disabled Pages

- Messages page access is blocked.
- Requests page access is blocked.
- Reviews page access is blocked.
- Admin panel access is blocked.

### Redirection

- Attempts to open disabled authenticated pages redirect the user to the
  dashboard.
- The navbar only shows pages that should be visible during the presentation.
