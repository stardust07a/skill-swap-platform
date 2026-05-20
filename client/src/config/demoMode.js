export const PRESENTATION_DEMO_MODE =
  import.meta.env.VITE_PRESENTATION_DEMO_MODE === 'true'

export const DEMO_DISABLED_PATHS = [
  '/matches',
  '/users',
  '/messages',
  '/requests',
  '/reviews',
  '/admin',
  '/profile/edit',
]

export const isDemoDisabledPath = (pathname) =>
  PRESENTATION_DEMO_MODE &&
  DEMO_DISABLED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
