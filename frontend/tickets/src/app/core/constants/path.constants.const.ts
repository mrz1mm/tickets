export const Path = {
  ADMIN: {
    BASE: 'admin',
    USER_MANAGEMENT: 'admin/user-management',
  },
  AUTH: {
    BASE: 'auth',
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
  },

  DASHBOARD: 'dashboard',
  DEPARTMENTS: 'departments',
  PROFILE: 'profile',
  PRIVACY_POLICY: 'privacy-policy',

  SUPER_ADMIN: {
    BASE: 'super-admin',
    COMPANY_MANAGEMENT: 'super-admin/company-management',
  },

  TICKETS: {
    BASE: 'tickets',
    DETAIL: 'tickets/:ticketId',
    UPDATE: 'tickets/:ticketId/update',
    QUEUE: 'tickets/queue',
  },

  NOT_FOUND: '**',
} as const;
