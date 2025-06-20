import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PathConstants } from '../../../core/constants/path.constants';

/**
 * Un route guard che protegge le rotte private.
 * Se l'utente non è autenticato, viene reindirizzato alla pagina di login.
 * @returns {boolean | UrlTree} True se l'utente può accedere, altrimenti un UrlTree per il reindirizzamento.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree([PathConstants.AUTH.LOGIN]);
};
