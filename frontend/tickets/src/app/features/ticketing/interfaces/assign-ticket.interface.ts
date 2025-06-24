/**
 * Rappresenta il payload per l'assegnazione di un ticket a un utente.
 * Corrisponde al DTO `AssignTicketDto` del backend.
 */
export interface AssignTicket {
  /**
   * L'ID dell'utente a cui il ticket viene assegnato.
   */
  assigneeId: number;
}
