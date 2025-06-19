import {
  Injectable,
  WritableSignal,
  signal,
  effect,
  inject,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { StorageConfig, StorageKey } from '../enums/storage-keys.enum';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root',
})
export class CookiePersistentService {
  private cookieSvc = inject(CookieService);
  private platformSvc = inject(PlatformService);

  /**
   * Crea un Signal il cui stato è persistito come proprietà all'interno
   * di un unico cookie JSON.
   * @param key La chiave della proprietà all'interno dell'oggetto store.
   * @param initialState Il valore iniziale se la proprietà non è presente nello store.
   * @returns Un WritableSignal<T> reattivo e persistito.
   */
  public PSignal<T>(key: StorageKey, initialState: T): WritableSignal<T> {
    if (!this.platformSvc.isBrowser) {
      return signal<T>(initialState);
    }

    // 1. Leggiamo l'intero store dal cookie, non più un valore singolo.
    const store = this.getStore();

    // 2. Inizializziamo il signal con il valore specifico dallo store o con quello di default.
    const signalState = signal<T>(
      store[key] !== undefined ? store[key] : initialState
    );

    // 3. L'effect si attiva ogni volta che il valore del signal cambia.
    effect(() => {
      // Per evitare scritture multiple e race condition, leggiamo sempre
      // lo stato più recente dello store prima di modificarlo.
      const currentStore = this.getStore();
      currentStore[key] = signalState(); // Aggiorniamo solo la nostra proprietà.
      this.saveStore(currentStore); // Salviamo l'intero store aggiornato.
    });

    return signalState;
  }

  /**
   * Legge e parsa l'intero oggetto store dal cookie principale.
   * Funziona solo lato browser.
   * @returns L'oggetto store parsato, o un oggetto vuoto in caso di errore o assenza.
   */
  private getStore(): any {
    if (this.cookieSvc.check(StorageConfig.STORE_COOKIE_KEY)) {
      try {
        const store = this.cookieSvc.get(StorageConfig.STORE_COOKIE_KEY);
        return store ? JSON.parse(store) : {};
      } catch (e) {
        console.error('Errore nel leggere/parsare lo store dal cookie', e);
        return {};
      }
    }
    return {};
  }

  /**
   * Salva (serializzando) l'intero oggetto store nel cookie principale.
   * Funziona solo lato browser.
   * @param store L'oggetto store completo da salvare.
   */
  private saveStore(store: any): void {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);

    try {
      this.cookieSvc.set(
        StorageConfig.STORE_COOKIE_KEY,
        JSON.stringify(store),
        {
          expires,
          path: '/',
          sameSite: 'Lax',
        }
      );
    } catch (e) {
      console.error('Errore nel salvare lo store nel cookie', e);
    }
  }
}
