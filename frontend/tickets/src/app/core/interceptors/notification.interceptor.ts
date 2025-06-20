import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { ToastService } from '../services/toast.service';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
  const toastSvc = inject(ToastService);

  if (!req.url.includes('/api/')) {
    return next(req);
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const body = event.body as ApiResponse<unknown>;

        if (!body || !body.message) {
          return;
        }

        if (event.status >= 200 && event.status < 300) {
          if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
            toastSvc.showSuccess('Successo', body.message);
          }
        } else if (event.status >= 400 && event.status < 500) {
          toastSvc.showError('Errore', body.message);
        } else if (event.status >= 500) {
          toastSvc.showError('Errore del Server', body.message);
        }
      }
    })
  );
};
