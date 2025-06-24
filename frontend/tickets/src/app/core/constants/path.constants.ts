export const Path = {
  AUTH: {
    BASE: 'auth',
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
  },

  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  PRIVACY_POLICY: 'privacy-policy',

  TICKETS: {
    BASE: 'tickets',
    CREATE: 'tickets/create',
    DETAIL: 'tickets/:ticketId',
    UPDATE: 'tickets/:ticketId/update',
  },

  NOT_FOUND: '**',
} as const;
