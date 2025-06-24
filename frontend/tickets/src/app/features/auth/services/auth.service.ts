import { Injectable, inject, computed, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';

// Servizi Core
import { CookiePersistentService } from '../../../core/services/cookie-persistent.service';
import { PlatformService } from '../../../core/services/platform.service';

// Costanti e Interfacce
import { ApiConstants } from '../../../core/constants/api.const';
import { Path } from '../../../core/constants/path.constants.const';
import { StorageConfig } from '../../../core/constants/storage-keys.const';
import { ApiResponse } from '../../../core/interfaces/api-response.interface';
import { UserDetail } from '../interfaces/user-detail.interface';
import { LoginRequest } from '../interfaces/login-request.interface';
import { RegisterRequest } from '../interfaces/register-request.interface';

// Aggiungiamo il tipo per la risposta del login che include il token
interface LoginResponse {
  user: UserDetail;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private persistentSvc = inject(CookiePersistentService);
  private platformSvc = inject(PlatformService);

  // --- STATO REATTIVO (letto direttamente dal servizio di persistenza) ---

  // Il token è la nostra unica fonte di verità per l'autenticazione
  private readonly token: Signal<string | null> = this.persistentSvc.getSlice(
    StorageConfig.KEYS.AUTH_TOKEN
  );

  // L'utente corrente è derivato dalla fetta dello store
  public readonly currentUser: Signal<UserDetail | null> =
    this.persistentSvc.getSlice(StorageConfig.KEYS.USER_INFO);

  // `isAuthenticated` è un signal calcolato che dipende solo dalla presenza del token
  public readonly isAuthenticated: Signal<boolean> = computed(
    () => !!this.token()
  );

  // Il costruttore ora non deve fare nulla all'avvio, lo stato si idrata da solo!
  constructor() {}

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
          // Dopo una chiamata di successo, aggiorniamo il nostro stato centrale
          this.persistentSvc.updateSlice(
            StorageConfig.KEYS.AUTH_TOKEN,
            payload.token
          );
          this.persistentSvc.updateSlice(
            StorageConfig.KEYS.USER_INFO,
            payload.user
          );

          // Aggiorniamo anche le preferenze nello store, se presenti
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
        map((payload) => payload.user), // Restituiamo solo l'utente al componente
        catchError((err) => {
          // In caso di errore, ci assicuriamo che lo stato sia pulito
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
            // Pulisce lo stato e reindirizza, indipendentemente dalla risposta del server
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
    // Potremmo anche decidere di non resettare tema e lingua al logout,
    // ma per ora lo facciamo per coerenza.
  }

  private clearAuthDataAndRedirect(): void {
    this.clearAuthData();
    this.router.navigateByUrl(Path.AUTH.LOGIN);
  }
}
