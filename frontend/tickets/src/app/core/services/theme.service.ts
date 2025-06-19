import {
  Injectable,
  effect,
  inject,
  isDevMode,
  WritableSignal,
} from '@angular/core';
import { CookiePersistentService } from './cookie-persistent.service';
import { StorageConfig } from '../enums/storage-keys.enum';
import { Theme } from '../interfaces/theme.types';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private persistentSvc = inject(CookiePersistentService);
  private platformSvc = inject(PlatformService);

  /**
   * Signal reattivo che contiene il tema corrente dell'applicazione.
   * È inizializzato leggendo il valore dal cookie o, in sua assenza,
   * deducendo il tema preferito dal sistema operativo dell'utente.
   * La sua persistenza è gestita automaticamente dal CookiePersistentService.
   */
  public theme: WritableSignal<Theme> = this.persistentSvc.PSignal<Theme>(
    StorageConfig.KEYS.THEME,
    this.getInitialSystemTheme()
  );

  constructor() {
    effect(() => {
      if (this.platformSvc.isBrowser) {
        const currentTheme = this.theme();
        this.applyThemeToDocument(currentTheme);
        if (isDevMode()) {
          console.log(`Tema cambiato in: ${currentTheme}`);
        }
      }
    });
  }

  // --- METODI PUBBLICI ---

  /**
   * Inverte il tema corrente da 'light' a 'dark' e viceversa.
   * Il cambiamento viene propagato automaticamente al DOM e persistito nel cookie
   * grazie alla natura reattiva del signal e dell'effect nel costruttore.
   */
  public toggleTheme(): void {
    this.theme.update((currentTheme) =>
      currentTheme === 'light' ? 'dark' : 'light'
    );
  }

  // --- METODI PRIVATI ---

  /**
   * Applica fisicamente la classe CSS corrispondente al tema sul tag <html>.
   * Questo metodo è sicuro perché viene chiamato solo all'interno di un blocco
   * `isPlatformBrowser`.
   * @param theme Il tema da applicare ('light' o 'dark').
   */
  private applyThemeToDocument(theme: Theme): void {
    const htmlElement = document.documentElement;
    // Rimuove i temi precedenti per evitare conflitti
    htmlElement.classList.remove('light-theme', 'dark-theme');
    // Aggiunge la classe del tema corrente
    htmlElement.classList.add(`${theme}-theme`);
    // Imposta l'attributo per la compatibilità con Bootstrap (se usato)
    htmlElement.setAttribute('data-bs-theme', theme);
  }

  /**
   * Rileva il tema preferito dall'utente a livello di sistema operativo.
   * È SSR-safe: se eseguito sul server, restituisce un valore di default ('light').
   * @returns 'dark' se il sistema operativo è in modalità scura, altrimenti 'light'.
   */
  private getInitialSystemTheme(): Theme {
    // Anche qui, il codice diventa più pulito
    if (this.platformSvc.isBrowser && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  }
}
