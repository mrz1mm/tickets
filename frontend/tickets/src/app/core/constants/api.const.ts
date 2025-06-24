export const ApiConstants = {
  AUTH: {
    BASE_URL: '/api/v1/auth',
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me',
    REGISTER: '/api/v1/auth/register',
  },

  DEPARTMENTS: {
    BASE_URL: '/api/v1/departments',
  },

  TICKETING: {
    /**
     * Endpoint base per le operazioni sui ticket.
     * Valore: `/api/v1/tickets`
     */
    BASE_URL: '/api/v1/tickets',

    /**
     * Endpoint per ottenere i dettagli di un singolo ticket.
     * Metodo: GET
     * @param id L'ID del ticket.
     * @returns Il percorso API, es. `/api/v1/tickets/123`
     */
    GET_BY_ID: (id: number) => `/api/v1/tickets/${id}`,

    /**
     * Endpoint per aggiungere un commento a un ticket.
     * Metodo: POST
     * @param id L'ID del ticket.
     * @returns Il percorso API, es. `/api/v1/tickets/123/comments`
     */
    ADD_COMMENT: (id: number) => `/api/v1/tickets/${id}/comments`,

    /**
     * Endpoint per assegnare un ticket.
     * Metodo: PATCH
     * @param id L'ID del ticket.
     * @returns Il percorso API, es. `/api/v1/tickets/123/assign`
     */
    ASSIGN: (id: number) => `/api/v1/tickets/${id}/assign`,

    /**
     * Endpoint per cambiare lo stato di un ticket.
     * Metodo: PATCH
     * @param id L'ID del ticket.
     * @returns Il percorso API, es. `/api/v1/tickets/123/status`
     */
    CHANGE_STATUS: (id: number) => `/api/v1/tickets/${id}/status`,

    /**
     * Endpoint per aggiungere un allegato a un ticket.
     * Metodo: POST (multipart/form-data)a
     * @param id L'ID del ticket.
     * @returns Il percorso API, es. `/api/v1/tickets/123/attachments`
     */
    ADD_ATTACHMENT: (id: number) => `/api/v1/tickets/${id}/attachments`,

    /**
     * Endpoint per scaricare un allegato.
     * Metodo: GET
     * @param attachmentId L'ID dell'allegato.
     * @returns Il percorso API, es. `/api/v1/tickets/attachments/456/download`
     */
    DOWNLOAD_ATTACHMENT: (attachmentId: number) =>
      `/api/v1/tickets/attachments/${attachmentId}/download`,
  },

  USERS: {
    UPDATE_PREFERENCES: '/api/v1/users/me/preferences',
  },
} as const;
