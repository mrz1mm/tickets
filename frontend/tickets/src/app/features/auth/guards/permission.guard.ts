import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Path } from '../../../core/constants/path.constants.const';

// Importa il nuovo servizio centralizzato per le notifiche UI
import { UiNotificationService } from '../../../core/services/ui-notification.service';

export const permissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);
  const notificationSvc = inject(UiNotificationService);
  const requiredPermission = route.data['requiredPermission'] as string;

  if (!requiredPermission) {
    notificationSvc.showTechnicalError();
    return router.parseUrl(Path.DASHBOARD);
  }

  if (!authSvc.isAuthenticated()) {
    return router.parseUrl(Path.AUTH.LOGIN);
  }

  const currentUser = authSvc.currentUser();

  if (!currentUser || !currentUser.roles) {
    notificationSvc.showAccessDenied();
    return router.parseUrl(Path.DASHBOARD);
  }

  const userPermissions = new Set<string>();
  currentUser.roles.forEach((role) => {
    if (role.permissions) {
      role.permissions.forEach((permission) => {
        userPermissions.add(permission.name);
      });
    }
  });

  const hasPermission = userPermissions.has(requiredPermission);

  if (hasPermission) {
    return true;
  } else {
    notificationSvc.showAccessDenied();
    return router.parseUrl(Path.DASHBOARD);
  }
};
