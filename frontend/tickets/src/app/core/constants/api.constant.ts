export const ApiConstants = {
  AUTH: {
    BASE_URL: '/api/v1/auth',
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me',
    REGISTER: '/api/v1/auth/register',
  },

  TICKETING: {
    BASE_URL: '/api/v1/tickets',
  },

  USERS: {
    UPDATE_PREFERENCES: '/api/v1/users/me/preferences',
  },
} as const;
