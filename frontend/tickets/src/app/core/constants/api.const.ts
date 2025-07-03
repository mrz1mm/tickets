const API_BASE_URL_V1 = '/api/v1';

export const ApiConstants = {
  ADMIN: {
    INVITE_USER: `${API_BASE_URL_V1}/admin/invitations`,
    GET_USERS: `${API_BASE_URL_V1}/admin/users`,
  },
  AUTH: {
    LOGIN: `${API_BASE_URL_V1}/auth/login`,
    REGISTER: `${API_BASE_URL_V1}/auth/register`,
    LOGOUT: `${API_BASE_URL_V1}/auth/logout`,
    ME: `${API_BASE_URL_V1}/auth/me`,
    VALIDATE_INVITATION: (token: string) =>
      `${API_BASE_URL_V1}/auth/invitation/${token}`,
  },

  COMPANIES: {
    BASE: `${API_BASE_URL_V1}/super-admin/companies`,
    BY_ID: (id: number) => `${API_BASE_URL_V1}/super-admin/companies/${id}`,
  },

  DEPARTMENTS: {
    BASE: `${API_BASE_URL_V1}/departments`,
    BY_ID: (id: number) => `${API_BASE_URL_V1}/departments/${id}`,
  },

  TICKETS: {
    BASE: `${API_BASE_URL_V1}/tickets`,
    BY_ID: (id: number) => `${API_BASE_URL_V1}/tickets/${id}`,
    ASSIGNED_TO_ME: `${API_BASE_URL_V1}/tickets/me/assigned`,
    UNASSIGNED: `${API_BASE_URL_V1}/tickets/unassigned`,
    ADD_COMMENT: (id: number) => `${API_BASE_URL_V1}/tickets/${id}/comments`,
    ASSIGN: (id: number) => `${API_BASE_URL_V1}/tickets/${id}/assign`,
    CHANGE_STATUS: (id: number) => `${API_BASE_URL_V1}/tickets/${id}/status`,
    ATTACHMENTS: (ticketId: number) =>
      `${API_BASE_URL_V1}/tickets/${ticketId}/attachments`,
    DOWNLOAD_ATTACHMENT: (attachmentId: number) =>
      `${API_BASE_URL_V1}/tickets/attachments/${attachmentId}/download`,
  },

  USERS: {
    UPDATE_PREFERENCES: `${API_BASE_URL_V1}/users/preferences`,
  },
} as const;
