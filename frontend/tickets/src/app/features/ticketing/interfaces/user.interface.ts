/**
 * Rappresenta una versione semplificata di un utente, usata
 * all'interno di altri DTO come requester o assignee di un ticket.
 * Corrisponde al DTO `UserDto` del backend.
 */
export interface User {
  id: number;
  email: string;
  displayName: string;
}
