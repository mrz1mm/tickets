/**
 * Rappresenta il payload per l'aggiunta di un commento a un ticket.
 * Corrisponde al DTO `AddCommentDto` del backend.
 */
export interface AddComment {
  /**
   * Il contenuto testuale del commento.
   */
  content: string;
}
