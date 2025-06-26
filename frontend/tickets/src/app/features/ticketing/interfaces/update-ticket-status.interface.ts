import { TicketStatus } from '../types/ticket-status.type';

/**
 * Rappresenta il payload per la modifica dello stato di un ticket.
 * Corrisponde al DTO `UpdateTicketStatusDto` del backend.
 */
export interface UpdateTicketStatus {
  status: TicketStatus;
}
