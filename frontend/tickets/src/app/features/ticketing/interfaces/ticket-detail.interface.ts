import { Department } from './department.interface';
import { TicketAttachment } from './ticket-attachment.interface';
import { TicketHistory } from './ticket-history.interface';
import { TicketPriority } from './ticket-priority.type';
import { TicketStatus } from './ticket-status.type';
import { User } from './user.interface';

/**
 * Rappresenta la vista di dettaglio completa di un ticket.
 * Corrisponde al DTO `TicketDetailDto` del backend.
 */
export interface TicketDetail {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  requester: User;
  assignee: User | null;
  department: Department;
  createdAt: string;
  updatedAt: string;
  history: TicketHistory[];
  attachments: TicketAttachment[];
}
