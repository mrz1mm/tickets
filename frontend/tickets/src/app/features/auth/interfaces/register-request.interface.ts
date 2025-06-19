/**
 * Rappresenta il payload per la richiesta di registrazione.
 */
export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}
