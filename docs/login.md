# Login Function Notes

This document summarizes the SCRUM-8 login function task.

## User Story

As a user, I want to log in to my Skill Swap account with my email and password
so that I can access my personal dashboard.

## Implementation Locations

Frontend login page:

- `client/src/pages/LoginPage.jsx`

Authentication context:

- `client/src/context/AuthContext.jsx`

Backend authentication controller:

- `server/src/controllers/authController.js`

Protected routing:

- `client/src/App.jsx`

## Login Flow

1. The user enters email and password on the login page.
2. The login form checks that both fields are filled.
3. The email value is trimmed before it is sent to the backend.
4. The frontend sends credentials to `POST /api/auth/login`.
5. The backend finds the user by email.
6. The backend compares the password with the stored bcrypt hash.
7. If credentials are valid, the backend returns a JWT token and user data.
8. The frontend stores the token in `localStorage`.
9. Axios sends the token with future requests through the `Authorization`
   header.
10. The user is redirected to `/dashboard`.

## Error Handling

The login screen shows an error when:

- email is empty
- password is empty
- the backend rejects the email or password
- the login request fails

The error container uses `role="alert"` so the message is announced by
assistive technologies.

## Acceptance Criteria Mapping

### Login Form

- The user can fill email and password fields.
- Empty fields show a warning before submitting.

### Authentication

- Correct credentials let the user enter the system.
- Incorrect email or password returns an error message.

### Redirection

- After successful login, the user is redirected to the dashboard.
- Unauthenticated users cannot access protected routes and are redirected to
  the login page.
