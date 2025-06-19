import { Role } from './role.interface';

/**
 * Rappresenta i dettagli completi di un utente autenticato.
 * Questa è l'informazione che riceviamo dopo un login andato a buon fine.
 */
export interface UserDetail {
  id: number;
  email: string;
  displayName: string;
  enabled: boolean;
  createdAt: string; // Le date vengono serializzate come stringhe ISO 8601
  roles: Set<Role>;
}
