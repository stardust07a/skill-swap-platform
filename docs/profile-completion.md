# Profile Completion Tracking Notes

This document summarizes the SCRUM-10 profile completion tracking task.

## User Story

As a user, I want to see my profile completion percentage and missing fields on
the dashboard so that I can complete my profile and receive more accurate
matches.

## Implementation Locations

Profile completion component:

- `client/src/components/ProfileCompletionCard.jsx`

Dashboard usage:

- `client/src/pages/Dashboard.jsx`

The dashboard passes the logged-in user, profile, teaching skills and learning
skills into `ProfileCompletionCard`.

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

Completed items use a green check icon and green text. Missing items use a red
warning icon and red text. The card also shows how many fields are still
missing, for example `3 alan eksik`.

## Progress Bar

The dashboard shows the completion value as both:

- a numeric percentage
- a visual progress bar

The progress bar includes accessibility attributes:

- `role="progressbar"`
- `aria-label="Profil tamamlama yüzdesi"`
- `aria-valuemin="0"`
- `aria-valuemax="100"`
- `aria-valuenow={percentage}`

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

## Verification

Frontend build command:

```bash
npm.cmd run build
```
