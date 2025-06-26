import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  switchMap,
  filter,
  distinctUntilChanged,
  combineLatest,
  catchError,
  of,
  map,
  skip, // Importiamo 'skip'
} from 'rxjs';
import { CookiePersistentService } from './cookie-persistent.service';
import { ApiConstants } from '../constants/api.const';
import { AuthService } from '../../features/auth/services/auth.service';
import { ErrorHandlingService } from './error-handling.service';
import { StorageConfig } from '../constants/storage-keys.const';
import { SILENT_REQUEST } from '../constants/silent-request.const';
import { UserPreferences } from '../interfaces/user-preferences.interface';

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  private http = inject(HttpClient);
  private persistentSvc = inject(CookiePersistentService);
  private authSvc = inject(AuthService);
  private errorSvc = inject(ErrorHandlingService);

  private theme$ = toObservable(
    this.persistentSvc.getSlice(StorageConfig.KEYS.THEME)
  );
  private language$ = toObservable(
    this.persistentSvc.getSlice(StorageConfig.KEYS.LANGUAGE)
  );

  constructor() {
    this.setupAutoSave();
  }

  /**
   * Imposta un "effetto" che osserva i cambiamenti nelle preferenze
   * e li invia al backend per la persistenza.
   */
  private setupAutoSave(): void {
    // Combiniamo solo gli stream che ci interessano per il backend
    combineLatest([this.theme$, this.language$])
      .pipe(
        // Saltiamo la primissima emissione che avviene all'avvio,
        // altrimenti salveremmo i valori di default sul backend prima del login.
        skip(1),
        // Salviamo solo se l'utente è autenticato
        filter(() => this.authSvc.isAuthenticated()),
        // Aspettiamo 1 secondo dopo l'ultima modifica
        debounceTime(1000),
        // Trasformiamo i valori in un oggetto UserPreferences
        map(([theme, language]) => ({ theme, language } as UserPreferences)),
        // Non inviare se l'oggetto è identico al precedente
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        ),
        // Passiamo alla chiamata HTTP
        switchMap((prefs) => {
          console.log('Sincronizzazione preferenze con il backend:', prefs);
          const context = new HttpContext().set(SILENT_REQUEST, true);
          return this.http.put(ApiConstants.USERS.UPDATE_PREFERENCES, prefs, {
            context,
          });
        }),
        catchError((err) => {
          this.errorSvc.handleHttpError(err);
          return of(null);
        })
      )
      .subscribe({
        next: () => console.log('Preferenze sincronizzate con successo.'),
      });
  }
}
