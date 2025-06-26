import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { Path } from '../constants/path.constants.const';

// Importa il nuovo servizio centralizzato per le notifiche UI
import { UiNotificationService } from '../services/ui-notification.service';

export const permissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);
  // Inietta il nostro nuovo gestore di notifiche UI
  const notificationSvc = inject(UiNotificationService);

  // 1. Recupera il permesso richiesto dalla configurazione della rotta.
  const requiredPermission = route.data['requiredPermission'] as string;

  if (!requiredPermission) {
    console.error(
      'PermissionGuard: Nessun permesso richiesto definito nella rotta. Blocco per sicurezza.'
    );
    // Anche in questo caso, deleghiamo la notifica
    notificationSvc.showTechnicalError(); // Aggiungeremo questo metodo
    return router.parseUrl(Path.DASHBOARD);
  }

  // 2. Controlla se l'utente è autenticato (controllo rapido).
  if (!authSvc.isAuthenticated()) {
    // Non mostriamo notifiche qui, perché l'authGuard si occuperà del reindirizzamento.
    // Questo è solo un ulteriore livello di sicurezza.
    return router.parseUrl(Path.AUTH.LOGIN);
  }

  // 3. Recupera l'utente e i suoi permessi.
  const currentUser = authSvc.currentUser();

  // Caso in cui l'utente è loggato ma non ha un profilo o ruoli (improbabile ma sicuro).
  if (!currentUser || !currentUser.roles) {
    notificationSvc.showAccessDenied();
    return router.parseUrl(Path.DASHBOARD);
  }

  // 4. Aggrega tutti i permessi da tutti i ruoli dell'utente in un Set per una ricerca efficiente.
  const userPermissions = new Set<string>();
  currentUser.roles.forEach((role) => {
    if (role.permissions) {
      role.permissions.forEach((permission) => {
        userPermissions.add(permission.name);
      });
    }
  });

  // 5. Verifica se l'utente possiede il permesso richiesto.
  const hasPermission = userPermissions.has(requiredPermission);

  if (hasPermission) {
    // Accesso consentito!
    return true;
  } else {
    // Accesso negato: delega la notifica e reindirizza.
    notificationSvc.showAccessDenied();
    return router.parseUrl(Path.DASHBOARD);
  }
};
