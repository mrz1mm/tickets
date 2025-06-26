import { HistoryEventType } from '../types/history-event.type';
import { User } from './user.interface';

/**
 * Rappresenta un singolo evento nella cronologia di un ticket.
 * Corrisponde al DTO `TicketHistoryDto` del backend.
 */
export interface TicketHistory {
  id: number;
  user: User; // L'utente che ha generato l'evento
  eventType: HistoryEventType;
  content: string; // Il contenuto dell'evento (es. il testo del commento)
  createdAt: string; // Data in formato ISO 8601
}
