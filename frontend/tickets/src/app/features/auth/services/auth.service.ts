import { Injectable, inject, computed, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { CookiePersistentService } from '../../../core/services/cookie-persistent.service';
import { PlatformService } from '../../../core/services/platform.service';
import { ApiConstants } from '../../../core/constants/api.const';
import { Path } from '../../../core/constants/path.constants.const';
import { StorageConfig } from '../../../core/constants/storage-keys.const';
import { ApiResponse } from '../../../core/interfaces/api-response.interface';
import { UserDetail } from '../interfaces/user-detail.interface';
import { LoginRequest } from '../interfaces/login-request.interface';
import { RegisterRequest } from '../interfaces/register-request.interface';
import { LoginResponse } from '../interfaces/login-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private persistentSvc = inject(CookiePersistentService);
  private platformSvc = inject(PlatformService);

  private readonly token: Signal<string | null> = this.persistentSvc.getSlice(
    StorageConfig.KEYS.AUTH_TOKEN
  );

  public readonly currentUser: Signal<UserDetail | null> =
    this.persistentSvc.getSlice(StorageConfig.KEYS.USER_INFO);

  public readonly isAuthenticated: Signal<boolean> = computed(
    () => !!this.token()
  );

  /**
   * Esegue il login dell'utente, salva lo stato e reindirizza.
   */
  public login(credentials: LoginRequest): Observable<UserDetail> {
    return this.http
      .post<ApiResponse<LoginResponse>>(ApiConstants.AUTH.LOGIN, credentials)
      .pipe(
        map((response) => {
          if (!response.payload?.token || !response.payload?.user) {
            throw new Error('Risposta di login non valida dal server.');
          }
          return response.payload;
        }),
        tap((payload) => {
          this.persistentSvc.updateSlice(
            StorageConfig.KEYS.AUTH_TOKEN,
            payload.token
          );
          this.persistentSvc.updateSlice(
            StorageConfig.KEYS.USER_INFO,
            payload.user
          );

          if (payload.user.preferences) {
            this.persistentSvc.updateSlice(
              StorageConfig.KEYS.THEME,
              payload.user.preferences.theme
            );
            this.persistentSvc.updateSlice(
              StorageConfig.KEYS.LANGUAGE,
              payload.user.preferences.language
            );
          }
        }),
        map((payload) => payload.user),
        catchError((err) => {
          this.clearAuthData();
          throw err;
        })
      );
  }

  /**
   * Esegue la registrazione di un nuovo utente.
   * Restituisce un booleano per indicare il successo.
   */
  public register(data: RegisterRequest): Observable<boolean> {
    return this.http
      .post<ApiResponse<unknown>>(ApiConstants.AUTH.REGISTER, data)
      .pipe(
        map(
          (response) => response.statusCode >= 200 && response.statusCode < 300
        ),
        catchError(() => of(false))
      );
  }

  /**
   * Esegue il logout dell'utente.
   */
  public logout(): void {
    if (this.platformSvc.isBrowser) {
      this.http
        .post<ApiResponse<null>>(ApiConstants.AUTH.LOGOUT, {})
        .pipe(
          finalize(() => {
            this.clearAuthDataAndRedirect();
          })
        )
        .subscribe();
    }
  }

  /**
   * Restituisce il token per l'HttpInterceptor.
   */
  public getToken(): string | null {
    return this.token();
  }

  /**
   * Pulisce tutti i dati di autenticazione dallo store.
   */
  private clearAuthData(): void {
    this.persistentSvc.updateSlice(StorageConfig.KEYS.AUTH_TOKEN, null);
    this.persistentSvc.updateSlice(StorageConfig.KEYS.USER_INFO, null);
  }

  private clearAuthDataAndRedirect(): void {
    this.clearAuthData();
    this.router.navigateByUrl(Path.AUTH.LOGIN);
  }
}
