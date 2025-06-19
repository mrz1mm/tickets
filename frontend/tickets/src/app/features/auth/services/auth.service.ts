import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError, map, finalize } from 'rxjs';
import { toast } from 'ngx-sonner';
import { PlatformService } from '../../../core/services/platform.service';
import { ApiConstants } from '../../../core/constants/api.constant';
import { LoginRequest } from '../interfaces/login-request.interface';
import { RegisterRequest } from '../interfaces/register-request.interface';
import { UserDetail } from '../interfaces/user-detail.interface';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformSvc = inject(PlatformService);
  private translocoSvc = inject(TranslocoService);

  public isAuthenticated = signal<boolean>(false);
  public currentUser = signal<UserDetail | null>(null);

  constructor() {
    if (this.platformSvc.isBrowser) {
      this.checkAuthStatus().subscribe();
    }
  }

  /**
   * Esegue il login e notifica l'utente dell'esito in modo internazionalizzato.
   */
  public login(credentials: LoginRequest): Observable<UserDetail | null> {
    return this.http
      .post<UserDetail>(ApiConstants.AUTH.LOGIN, credentials)
      .pipe(
        tap((user) => {
          this.isAuthenticated.set(true);
          this.currentUser.set(user);
          // 3. Usa le chiavi di traduzione
          const title = this.translocoSvc.translate(
            'notifications.loginSuccessTitle'
          );
          const message = this.translocoSvc.translate(
            'notifications.loginSuccessMessage',
            { displayName: user.displayName }
          );
          toast.success(title, { description: message });
        }),
        catchError((error) => {
          const title = this.translocoSvc.translate(
            'notifications.loginErrorTitle'
          );
          const message = this.translocoSvc.translate(
            'notifications.loginErrorMessage'
          );
          toast.error(title, { description: message });
          return of(null);
        })
      );
  }

  /**
   * Esegue la registrazione e notifica l'utente dell'esito in modo internazionalizzato.
   */
  public register(data: RegisterRequest): Observable<boolean> {
    return this.http.post<void>(ApiConstants.AUTH.REGISTER, data).pipe(
      map(() => {
        const title = this.translocoSvc.translate(
          'notifications.registerSuccessTitle'
        );
        const message = this.translocoSvc.translate(
          'notifications.registerSuccessMessage'
        );
        toast.success(title, { description: message });
        return true;
      }),
      catchError((error) => {
        const title = this.translocoSvc.translate(
          'notifications.registerErrorTitle'
        );
        const messageKey =
          error.status === 409
            ? 'notifications.registerErrorConflict'
            : 'notifications.registerErrorGeneral';
        const message = this.translocoSvc.translate(messageKey);
        toast.error(title, { description: message });
        return of(false);
      })
    );
  }

  /**
   * Esegue il logout e notifica l'utente in modo internazionalizzato.
   */
  public logout(): void {
    this.http
      .post(ApiConstants.AUTH.LOGOUT, {})
      .pipe(
        finalize(() => {
          this.isAuthenticated.set(false);
          this.currentUser.set(null);
          this.router.navigate(['/auth/login'], { replaceUrl: true });
          // Usa la chiave di traduzione per il logout
          const message = this.translocoSvc.translate(
            'notifications.logoutInfo'
          );
          toast.info(message);
        })
      )
      .subscribe();
  }

  /**
   * Controlla lo stato di autenticazione in modo silente.
   * (Nessuna notifica necessaria qui)
   */
  public checkAuthStatus(): Observable<boolean> {
    return this.http.get<UserDetail>(ApiConstants.AUTH.ME).pipe(
      map((user) => {
        this.isAuthenticated.set(true);
        this.currentUser.set(user);
        return true;
      }),
      catchError(() => {
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
        return of(false);
      })
    );
  }
}
