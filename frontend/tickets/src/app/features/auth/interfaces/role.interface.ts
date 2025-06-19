import { Permission } from './permission.interface';

/**
 * Rappresenta un ruolo utente, che contiene un insieme di permessi.
 * Es. 'ROLE_ADMIN', 'ROLE_USER'.
 */
export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Set<Permission>;
}
