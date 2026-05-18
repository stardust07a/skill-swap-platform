# Profile Completion Tracking Notes

This document summarizes the SCRUM-10 profile completion tracking task.

## User Story

As a user, I want to see my profile completion percentage and missing fields on
the dashboard so that I can complete my profile and receive more accurate
matches.

## Implementation Location

The profile completion tracking UI is implemented in:

- `client/src/pages/Dashboard.jsx`

The dashboard reads the logged-in user from `AuthContext` and calculates
completion from the user's profile and skill data.

## Completion Percentage

The profile completion percentage is calculated from these checklist items:

- profile photo
- bio
- city and district
- teaching skills
- learning skills
- availability text
- swap or paid lesson preference

The percentage is calculated by dividing completed checklist items by the total
number of checklist items.

## Missing Fields

The missing fields panel is shown under `Eksik Alanlar`.

Completed items use a success icon and green text. Missing items use a warning
icon and red text. This lets the user quickly understand which profile areas
still need attention.

## Progress Bar

The dashboard shows the completion value as both:

- a numeric percentage
- a visual progress bar

The progress bar also includes accessibility attributes:

- `role="progressbar"`
- `aria-label="Profil tamamlama yüzdesi"`
- `aria-valuemin="0"`
- `aria-valuemax="100"`
- `aria-valuenow={profilePct}`

This keeps the visual status understandable for assistive technologies as well.

## Acceptance Criteria Mapping

### Profile Completion Percentage

- The completion percentage is displayed on the dashboard.
- The percentage is calculated from filled profile fields.
- The value is supported by a visual progress bar.

### Missing Fields

- Profile photo is checked.
- Bio is checked.
- City and district are checked.
- Teaching skills are checked.
- Learning skills are checked.
- Availability text is checked.
- Swap or paid lesson preference is checked.

### Status Display

- Completed fields are shown with a green check icon.
- Missing fields are shown with a red warning icon.
