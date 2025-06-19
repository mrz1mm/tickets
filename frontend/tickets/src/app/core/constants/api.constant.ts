export const ApiConstants = {
  AUTH: {
    BASE_URL: '/api/v1/auth',
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me',
  },

  TICKETING: {
    BASE_URL: '/api/v1/tickets',
  },
} as const;
