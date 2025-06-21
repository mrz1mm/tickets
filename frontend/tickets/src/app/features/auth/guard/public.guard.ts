import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Path } from '../../../core/constants/path.constants';

/**
 * Un route guard che protegge le rotte pubbliche (es. login, register).
 * Se l'utente è già autenticato, viene reindirizzato alla dashboard.
 * @returns {boolean | UrlTree} True se la rotta può essere attivata, altrimenti un UrlTree per il reindirizzamento.
 */
export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/']);
  }

  return router.createUrlTree([Path.DASHBOARD]);
};
