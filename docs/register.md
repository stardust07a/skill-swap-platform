# Register Function Notes

This document summarizes the SCRUM-7 user registration task.

## User Story

As a user, I want to create a Skill Swap account with my full name, email and
password so that I can log in, add my skills and match with other users.

## Implementation Locations

Frontend register page:

- `client/src/pages/RegisterPage.jsx`

Authentication context:

- `client/src/context/AuthContext.jsx`

Backend authentication controller:

- `server/src/controllers/authController.js`

Protected dashboard route:

- `client/src/App.jsx`

## Register Flow

1. The user fills full name, email, password and password confirmation fields.
2. The register form validates required fields before sending a request.
3. The email value is trimmed and checked with a basic email format rule.
4. The password must be at least 6 characters.
5. Password and password confirmation must match.
6. The frontend sends valid form data to `POST /api/auth/register`.
7. The backend creates the user and the initial profile record.
8. The backend returns a JWT token and public user data.
9. The frontend stores the token in `localStorage`.
10. The user is redirected to `/dashboard`.

## Error Handling

The register screen shows an error when:

- full name is empty
- email is empty or not in a valid format
- password is empty or shorter than 6 characters
- password confirmation is empty
- password and password confirmation do not match
- the backend rejects the registration request

The main error container uses `role="alert"` so the message is announced by
assistive technologies. Field-level errors use `aria-invalid` and
`aria-describedby` to connect each input with its validation message.

## Acceptance Criteria Mapping

### Register Form

- The user can fill full name, email, password and password confirmation fields.
- Empty required fields show a warning before submitting.
- The email field must be in a valid format.

### Password Control

- Password must be at least 6 characters.
- Password and password confirmation must match.
- A warning is shown when passwords do not match.

### Successful Registration

- After successful registration, the user is redirected to the dashboard.
- The backend creates the basic profile record for the new user.
