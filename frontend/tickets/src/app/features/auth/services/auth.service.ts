import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, tap, catchError, map, finalize } from 'rxjs';
import { PlatformService } from '../../../core/services/platform.service';
import { UserPreferencesService } from '../../../core/services/user-preferences.service';
import { ApiResponse } from '../../../core/interfaces/api-response';
import { UserDetail } from '../interfaces/user-detail.interface';
import { LoginRequest } from '../interfaces/login-request.interface';
import { ApiConstants } from '../../../core/constants/api.constant';
import { RegisterRequest } from '../interfaces/register-request.interface';
import { Path } from '../../../core/constants/path.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformSvc = inject(PlatformService);
  private prefsSvc = inject(UserPreferencesService);

  public isAuthenticated = signal<boolean>(false);
  public currentUser = signal<UserDetail | null>(null);

  constructor() {
    if (this.platformSvc.isBrowser) {
      this.checkAuthStatus().subscribe();
    }
  }

  /**
   * Esegue il login dell'utente.
   */
  public login(credentials: LoginRequest): Observable<UserDetail | null> {
    return this.http
      .post<ApiResponse<UserDetail>>(ApiConstants.AUTH.LOGIN, credentials)
      .pipe(
        tap((response) => {
          if (response.payload) {
            this.isAuthenticated.set(true);
            this.currentUser.set(response.payload);
            this.prefsSvc.setInitialPreferences(
              response.payload.preferences || {}
            );
          }
        }),
        map((response) => response.payload),
        catchError(() => of(null))
      );
  }

  /**
   * Esegue la registrazione di un nuovo utente.
   */
  public register(data: RegisterRequest): Observable<boolean> {
    return this.http
      .post<ApiResponse<null>>(ApiConstants.AUTH.REGISTER, data)
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
    this.http
      .post<ApiResponse<null>>(ApiConstants.AUTH.LOGOUT, {})
      .pipe(
        finalize(() => {
          this.isAuthenticated.set(false);
          this.currentUser.set(null);
          this.prefsSvc.clearPreferences();
          this.router.navigate([Path.AUTH.LOGIN], {
            replaceUrl: true,
          });
        })
      )
      .subscribe();
  }

  /**
   * Controlla lo stato di autenticazione all'avvio dell'app.
   */
  public checkAuthStatus(): Observable<boolean> {
    return this.http.get<ApiResponse<UserDetail>>(ApiConstants.AUTH.ME).pipe(
      map((response) => {
        // La chiamata ha avuto successo, quindi l'utente è autenticato.
        this.isAuthenticated.set(true);
        this.currentUser.set(response.payload);
        this.prefsSvc.setInitialPreferences(
          response.payload?.preferences || {}
        );
        return true;
      }),
      catchError(() => {
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
        this.prefsSvc.clearPreferences();
        return of(false);
      })
    );
  }
}
