import { Injectable, WritableSignal, inject } from '@angular/core';
import { CookiePersistentService } from './cookie-persistent.service';
import { StorageConfig } from '../enums/storage-keys.enum';
import { Cookie } from '../interfaces/cookie.interface';

@Injectable({
  providedIn: 'root',
})
export class CookiePreferenceService {
  private persistentSvc = inject(CookiePersistentService);

  /**
   * Signal reattivo che contiene le preferenze dei cookie dell'utente.
   * Inizializzato con un oggetto Cookie con valori predefiniti.
   * La persistenza è gestita automaticamente dal CookiePersistentService.
   */
  #cookiePreferences: WritableSignal<Cookie | null> =
    this.persistentSvc.PSignal<Cookie | null>(
      StorageConfig.KEYS.COOKIE_PREFERENCES,
      null
    );

  /**
   * Signal pubblico di sola lettura per esporre le preferenze dei cookie
   * in modo sicuro al resto dell'applicazione.
   */
  public cookiePreferences = this.#cookiePreferences.asReadonly();

  /**
   * Imposta le preferenze per accettare tutti i tipi di cookie opzionali.
   * Aggiorna il signal, che a sua volta salva lo stato nel cookie.
   */
  public acceptAll(): void {
    this.#cookiePreferences.set({
      essentialCookies: true,
      analyticsCookies: true,
      functionalCookies: true,
      targetingCookies: true,
    });
  }

  /**
   * Imposta le preferenze per rifiutare tutti i tipi di cookie opzionali.
   * Aggiorna il signal, che a sua volta salva lo stato nel cookie.
   */
  public rejectAll(): void {
    this.#cookiePreferences.set({
      essentialCookies: true,
      analyticsCookies: false,
      functionalCookies: false,
      targetingCookies: false,
    });
  }

  /**
   * Salva una configurazione personalizzata delle preferenze dei cookie.
   * @param preferences Un oggetto parziale con le scelte dell'utente.
   */
  public saveCustom(preferences: Partial<Cookie>): void {
    this.#cookiePreferences.set({
      essentialCookies: true,
      analyticsCookies: !!preferences.analyticsCookies,
      functionalCookies: !!preferences.functionalCookies,
      targetingCookies: !!preferences.targetingCookies,
    });
  }
}
