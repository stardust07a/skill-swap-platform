# Profile Edit Function Notes

This document summarizes the SCRUM-11 profile edit function task.

## User Story

As a user, I want to edit my profile information so that other users can know
me better and match with me more accurately.

## Implementation Locations

Frontend profile edit page:

- `client/src/pages/ProfileEditPage.jsx`

Backend profile controller:

- `server/src/controllers/profileController.js`

Profile routes:

- `server/src/routes/profile.js`

## Editable Profile Fields

The profile edit form supports:

- full name
- profile photo URL
- bio
- city
- district
- swap availability
- paid lesson availability
- hourly rate for paid lessons
- availability text

The page also lets users manage teaching and learning skills.

## Save Flow

1. The user updates profile fields on the profile edit page.
2. The frontend validates that the full name is not empty.
3. Text fields are trimmed before sending the update request.
4. The frontend sends the update to `PUT /api/profile/me`.
5. The backend updates the `User` row and upserts the related `Profile` row.
6. The frontend refreshes the authenticated user with `fetchMe()`.
7. A success message is shown after a successful save.
8. An error message is shown if the update fails.

## Accessibility Notes

- Success messages use `role="status"`.
- Error messages use `role="alert"`.

These roles make save feedback clearer for assistive technologies.

## Acceptance Criteria Mapping

### Basic Information

- The user can update profile photo URL.
- The user can update bio.
- The user can update city and district.

### Lesson Preferences

- The user can choose whether they are available for free skill swap.
- The user can choose whether they provide paid lessons.
- The user can write availability information.

### Save Behavior

- The user can save profile changes.
- A success message is displayed after a successful save.
- An error message is displayed if the save request fails.
