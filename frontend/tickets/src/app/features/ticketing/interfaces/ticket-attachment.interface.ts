import { User } from './user.interface';

/**
 * Rappresenta un singolo allegato associato a un ticket.
 * Corrisponde al DTO `TicketAttachmentDto` del backend.
 */
export interface TicketAttachment {
  id: number;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  uploader: User;
  createdAt: string; // Data in formato ISO 8601
  downloadUrl: string; // URL per il download generato dal backend
}
