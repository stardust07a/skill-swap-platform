# Profile Edit Function Notes

This document summarizes the SCRUM-11 profile edit task.

## User Story

As a user, I want to edit my profile information so that other users can know me
better on the Skill Swap platform.

## Implementation Location

Frontend profile edit page:

- `client/src/pages/ProfileEditPage.jsx`

Authentication context:

- `client/src/context/AuthContext.jsx`

Profile API service usage:

- `PUT /api/profile/me`

## Profile Edit Flow

1. The page fills the form with the logged-in user's current profile data.
2. The user can edit profile photo URL, name, bio, city and district.
3. The user can select swap availability and paid lesson availability.
4. The user can enter hourly rate when paid lesson is enabled.
5. The user can write availability text.
6. The frontend validates required and invalid values before saving.
7. The frontend sends profile changes to `PUT /api/profile/me`.
8. After a successful save, the user data is refreshed and a success message is shown.
9. If saving fails, the page shows an error message.

## Validation and Feedback

The page checks:

- name is required
- profile photo URL must start with `http://` or `https://` when filled
- hourly rate cannot be negative

The success message uses `role="status"`. Error messages use `role="alert"` and
field-level inputs use `aria-invalid` and `aria-describedby` where validation is
shown.

## Acceptance Criteria Mapping

### Basic Information

- The user can enter a profile photo URL.
- The user can edit bio information.
- The user can enter city and district information.

### Lesson Preferences

- The user can choose whether they are available for free swap.
- The user can choose whether they give paid lessons.
- The user can write availability text.

### Save Process

- The user can save profile changes.
- A success message is shown after a successful save.
- An error message is shown when saving fails.

## Verification

Frontend build command:

```bash
npm.cmd run build
```
