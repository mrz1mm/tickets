import {
  HttpInterceptorFn,
  HttpResponse,
  HttpContext,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { ToastService } from '../services/toast.service';
import { ErrorHandlingService } from '../services/error-handling.service';
import { SILENT_REQUEST } from '../constants/silent-request.const';

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
  const toastSvc = inject(ToastService);
  const errorSvc = inject(ErrorHandlingService);

  if (!req.url.includes('/api/')) {
    return next(req);
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const body = event.body as ApiResponse<unknown>;

        if (req.context.get(SILENT_REQUEST)) {
          return;
        }

        if (body && body.message && event.status >= 200 && event.status < 300) {
          if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
            toastSvc.showSuccess('Successo', body.message);
          }
        }
      }
    }),
    catchError((error) => {
      errorSvc.handleHttpError(error);
      return throwError(() => error);
    })
  );
};
