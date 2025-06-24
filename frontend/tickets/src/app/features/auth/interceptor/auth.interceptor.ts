import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken(); // Assumiamo che tu abbia un metodo per prendere il token

  // Se il token esiste, clona la richiesta e aggiungi l'header
  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return next(authReq);
  }

  // Se non c'è token, lascia passare la richiesta così com'è (es. per login/register)
  return next(req);
};
