import { Department } from '../../department/interfaces/department.interface';
import { TicketPriority } from '../types/ticket-priority.type';
import { TicketStatus } from '../types/ticket-status.type';
import { User } from './user.interface';

/**
 * Rappresenta una vista sintetica di un ticket, usata nelle liste.
 * Corrisponde al DTO `TicketSummaryDto` del backend.
 */
export interface TicketSummary {
  id: number;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  requester: User;
  assignee: User | null;
  department: Department;
  createdAt: string;
  updatedAt: string;
}
