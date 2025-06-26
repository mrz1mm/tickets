import { TicketPriority } from '../types/ticket-priority.type';

/**
 * Rappresenta il payload per la modifica dei dettagli base di un ticket.
 * Corrisponde al DTO `UpdateTicketDto` del backend.
 * Tutti i campi sono opzionali.
 */
export interface UpdateTicket {
  title?: string;
  description?: string;
  departmentId?: number;
  priority?: TicketPriority;
}
