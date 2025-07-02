import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Path } from '../../../core/constants/path.constants.const';
import { UiNotificationService } from '../../../core/services/ui-notification.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);
  const notificationSvc = inject(UiNotificationService);

  const requiredRole = route.data['requiredRole'] as string;

  if (!requiredRole) {
    console.error(
      'RoleGuard: Nessun ruolo richiesto definito nella rotta. Blocco per sicurezza.'
    );
    notificationSvc.showTechnicalError();
    return router.parseUrl(Path.DASHBOARD);
  }
  if (!authSvc.isAuthenticated()) {
    return router.parseUrl(Path.AUTH.LOGIN);
  }

  const hasRole = authSvc.hasRole(requiredRole);

  if (hasRole) {
    return true;
  } else {
    notificationSvc.showAccessDenied();
    return router.parseUrl(Path.DASHBOARD);
  }
};
