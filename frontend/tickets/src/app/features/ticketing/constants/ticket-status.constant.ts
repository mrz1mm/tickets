import { TicketStatus } from '../types/ticket-status.type';

export const TICKET_STATUS: TicketStatus[] = [
  'APERTO',
  'IN_LAVORAZIONE',
  'IN_ATTESA_UTENTE',
  'BLOCCATO',
  'RISOLTO',
  'CHIUSO_RISOLTO',
  'CHIUSO_IRRISOLTO',
  'CHIUSO_RIGETTATO',
];
