import {
  Injectable,
  inject,
  signal,
  WritableSignal,
  effect,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime, switchMap, filter } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Theme } from '../interfaces/theme.types'; // Assumendo che sia in core/interfaces
import { ApiConstants } from '../constants/api.constant';

export interface UserPreferences {
  theme?: Theme;
  language?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  private http = inject(HttpClient);

  public preferences: WritableSignal<UserPreferences | null> = signal(null);

  constructor() {
    this.setupAutoSave();
  }

  /**
   * Imposta le preferenze iniziali, solitamente chiamato dopo il login.
   * @param prefs L'oggetto delle preferenze ricevuto dal backend.
   */
  public setInitialPreferences(prefs: UserPreferences): void {
    this.preferences.set(prefs || {});
  }

  /**
   * Pulisce le preferenze, solitamente chiamato al logout.
   */
  public clearPreferences(): void {
    this.preferences.set(null);
  }

  /**
   * Aggiorna una specifica preferenza.
   * @param key La chiave della preferenza da aggiornare.
   * @param value Il nuovo valore.
   */
  public updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): void {
    this.preferences.update((currentPrefs) => {
      if (!currentPrefs) return null;
      return { ...currentPrefs, [key]: value };
    });
  }

  /**
   * Imposta un effetto che osserva i cambiamenti nelle preferenze
   * e li invia al backend dopo debounce per evitare
   * chiamate API eccessive.
   */
  private setupAutoSave(): void {
    toObservable(this.preferences)
      .pipe(
        filter((prefs) => prefs !== null),
        debounceTime(500),
        switchMap((prefs) =>
          this.http.put(ApiConstants.USERS.UPDATE_PREFERENCES, prefs)
        )
      )
      .subscribe({
        next: () => console.log('Preferenze salvate sul server.'),
        error: (err) =>
          console.error('Errore durante il salvataggio delle preferenze:', err),
      });
  }
}
