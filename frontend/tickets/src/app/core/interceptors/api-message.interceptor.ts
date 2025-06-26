import {
  HttpInterceptorFn,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { UiNotificationService } from '../services/ui-notification.service';

export const apiMessageInterceptor: HttpInterceptorFn = (req, next) => {
  const uiNotificationSvc = inject(UiNotificationService);

  if (!req.url.includes('/api/')) {
    return next(req);
  }

  return next(req).pipe(
    tap((event) => {
      if (
        event instanceof HttpResponse &&
        event.status >= 200 &&
        event.status < 300
      ) {
        const body = event.body as ApiResponse<unknown>;
        if (
          body?.message &&
          ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)
        ) {
          uiNotificationSvc.showSuccess(body.message);
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      uiNotificationSvc.handleHttpError(error);
      return throwError(() => error);
    })
  );
};
