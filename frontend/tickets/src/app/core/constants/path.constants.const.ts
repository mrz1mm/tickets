export const Path = {
  AUTH: {
    BASE: 'auth',
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
  },

  DASHBOARD: 'dashboard',
  DEPARTMENTS: 'departments',
  PROFILE: 'profile',
  PRIVACY_POLICY: 'privacy-policy',

  TICKETS: {
    BASE: 'tickets',
    DETAIL: 'tickets/:ticketId',
    UPDATE: 'tickets/:ticketId/update',
  },

  NOT_FOUND: '**',
} as const;
