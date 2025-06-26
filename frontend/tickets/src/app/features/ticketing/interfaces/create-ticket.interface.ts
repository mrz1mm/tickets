import { TicketPriority } from '../types/ticket-priority.type';

/**
 * Rappresenta il payload per la creazione di un nuovo ticket.
 * Corrisponde al DTO `CreateTicketDto` del backend.
 */
export interface CreateTicket {
  title: string;
  description: string;
  departmentId: number;
  priority: TicketPriority;
}
