import { Injectable, Signal, inject } from '@angular/core';
import { CookiePersistentService } from './cookie-persistent.service';
import { CookiePreferences } from '../interfaces/cookie-preference.interface';
import { StorageConfig } from '../constants/storage-keys.const';

@Injectable({
  providedIn: 'root',
})
export class CookiePreferenceService {
  private persistentSvc = inject(CookiePersistentService);

  public readonly cookiePreferences: Signal<CookiePreferences | null> =
    this.persistentSvc.getSlice(StorageConfig.KEYS.COOKIE_PREFERENCES);

  /**
   * Imposta le preferenze per accettare tutti i tipi di cookie opzionali.
   * Aggiorna la fetta di stato nel servizio di persistenza.
   */
  public acceptAll(): void {
    const newPreferences: CookiePreferences = {
      essentialCookies: true,
      analyticsCookies: true,
      functionalCookies: true,
      targetingCookies: true,
    };
    this.persistentSvc.updateSlice(
      StorageConfig.KEYS.COOKIE_PREFERENCES,
      newPreferences
    );
  }

  /**
   * Imposta le preferenze per rifiutare tutti i tipi di cookie opzionali.
   * Aggiorna la fetta di stato nel servizio di persistenza.
   */
  public rejectAll(): void {
    const newPreferences: CookiePreferences = {
      essentialCookies: true,
      analyticsCookies: false,
      functionalCookies: false,
      targetingCookies: false,
    };
    this.persistentSvc.updateSlice(
      StorageConfig.KEYS.COOKIE_PREFERENCES,
      newPreferences
    );
  }

  /**
   * Salva una configurazione personalizzata delle preferenze dei cookie.
   * @param preferences Un oggetto parziale con le scelte dell'utente.
   */
  public saveCustom(preferences: Partial<CookiePreferences>): void {
    const currentPrefs = this.cookiePreferences() ?? { essentialCookies: true };
    const newPreferences: CookiePreferences = {
      essentialCookies: true,
      analyticsCookies: !!preferences.analyticsCookies,
      functionalCookies: !!preferences.functionalCookies,
      targetingCookies: !!preferences.targetingCookies,
    };
    this.persistentSvc.updateSlice(
      StorageConfig.KEYS.COOKIE_PREFERENCES,
      newPreferences
    );
  }
}
