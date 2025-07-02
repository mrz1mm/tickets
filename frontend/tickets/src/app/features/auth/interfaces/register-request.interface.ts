/**
 * Rappresenta il payload per la richiesta di registrazione.
 * Corrisponde al DTO `RegisterDto` del backend.
 */
export interface RegisterRequest {
  token: string;
  displayName: string;
  password: string;
}
