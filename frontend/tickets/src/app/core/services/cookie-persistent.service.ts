import {
  Injectable,
  WritableSignal,
  signal,
  effect,
  inject,
  Signal,
  computed,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { StorageConfig } from '../constants/storage-keys.const';
import { PlatformService } from './platform.service';
import { AppState } from '../interfaces/app-state.interface';
import { DEFAULT_APP_STATE } from '../constants/default-app-state.const';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class CookiePersistentService {
  private cookieSvc = inject(CookieService);
  private platformSvc = inject(PlatformService);
  private errorSvc = inject(ErrorHandlingService);

  #appState: WritableSignal<AppState>;

  constructor() {
    this.#appState = signal(this.getInitialState());

    effect(() => {
      if (this.platformSvc.isBrowser) {
        this.saveStore(this.#appState());
      }
    });
  }

  /**
   * Restituisce uno specifico parziale di sola lettura dello stato.
   */
  public getSlice<K extends keyof AppState>(key: K): Signal<AppState[K]> {
    return computed(() => this.#appState()[key]);
  }

  /**
   * Aggiorna uno specifico parziale dello stato.
   */
  public updateSlice<K extends keyof AppState>(
    key: K,
    value: AppState[K]
  ): void {
    this.#appState.update((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  }

  private getInitialState(): AppState {
    if (!this.platformSvc.isBrowser) {
      return DEFAULT_APP_STATE;
    }
    if (this.cookieSvc.check(StorageConfig.STORE_COOKIE_KEY)) {
      try {
        const storeJson = this.cookieSvc.get(StorageConfig.STORE_COOKIE_KEY);
        const parsedState = storeJson ? JSON.parse(storeJson) : {};
        return { ...DEFAULT_APP_STATE, ...parsedState };
      } catch (e) {
        this.errorSvc.handleClientError(e as Error, 'errors.cookieRead');
        return DEFAULT_APP_STATE;
      }
    }
    return DEFAULT_APP_STATE;
  }

  private saveStore(store: AppState): void {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    try {
      this.cookieSvc.set(
        StorageConfig.STORE_COOKIE_KEY,
        JSON.stringify(store),
        { expires, path: '/', sameSite: 'Lax' }
      );
    } catch (e) {
      this.errorSvc.handleClientError(e as Error, 'errors.cookieSave');
    }
  }
}
