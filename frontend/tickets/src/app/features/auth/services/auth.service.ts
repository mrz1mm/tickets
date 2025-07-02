import { Injectable, inject, computed, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
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
import { WebSocketService } from '../../../core/services/websocket.service';
import { NotificationStoreService } from '../../../core/services/notification-store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private persistentSvc = inject(CookiePersistentService);
  private platformSvc = inject(PlatformService);
  private websocketSvc = inject(WebSocketService);
  private notificationStore = inject(NotificationStoreService);

  private readonly token: Signal<string | null> = this.persistentSvc.getSlice(
    StorageConfig.KEYS.AUTH_TOKEN
  );

  public readonly currentUser: Signal<UserDetail | null> =
    this.persistentSvc.getSlice(StorageConfig.KEYS.USER_INFO);

  public readonly isAuthenticated: Signal<boolean> = computed(
    () => !!this.token()
  );

  /**
   * Recupera l'utente corrente dal cookie.
   * @returns L'utente corrente o null se non autenticato.
   */
  public login(credentials: LoginRequest): Observable<UserDetail | undefined> {
    return this.http
      .post<ApiResponse<LoginResponse>>(ApiConstants.AUTH.LOGIN, credentials)
      .pipe(
        map((response) => response.payload),
        tap((payload) => {
          if (!payload) return;

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
          this.notificationStore.init();
          this.websocketSvc.connect();
        }),
        map((payload) => payload?.user)
      );
  }

  /**
   * Verifica se il token di invito è valido.
   * @param token Il token di invito da validare.
   * @return Un Observable che emette il token se valido, altrimenti un errore.
   * */
  public validateInvitationToken(token: string): Observable<string> {
    return this.http
      .get<ApiResponse<string>>(ApiConstants.AUTH.VALIDATE_INVITATION(token))
      .pipe(map((response) => response.payload!));
  }

  /**
   * Esegue la registrazione di un nuovo utente.
   */
  public register(data: RegisterRequest): Observable<boolean> {
    return this.http
      .post<ApiResponse<void>>(ApiConstants.AUTH.REGISTER, data)
      .pipe(
        map(
          (response) => response.statusCode >= 200 && response.statusCode < 300
        )
      );
  }

  /**
   * Esegue il logout dell'utente.
   */
  public logout(): void {
    if (this.platformSvc.isBrowser) {
      this.websocketSvc.disconnect();
      this.notificationStore.destroy();
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
   * Controlla se l'utente corrente possiede un determinato permesso.
   */
  public hasPermission(permissionName: string): boolean {
    const user = this.currentUser();
    if (!user || !user.roles) {
      return false;
    }

    for (const role of user.roles) {
      if (role.permissions) {
        for (const permission of role.permissions) {
          if (permission.name === permissionName) {
            return true;
          }
        }
      }
    }
    return false;
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
