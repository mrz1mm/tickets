import { Injectable, effect, inject, Signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { CookiePersistentService } from './cookie-persistent.service';
import { StorageConfig } from '../constants/storage-keys.const';
import { Language } from '../types/language.type';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translocoSvc = inject(TranslocoService);
  private persistentSvc = inject(CookiePersistentService);

  public readonly activeLang: Signal<Language> = this.persistentSvc.getSlice(
    StorageConfig.KEYS.LANGUAGE
  );

  constructor() {
    effect(() => {
      const lang = this.activeLang();
      this.translocoSvc.setActiveLang(lang);
    });
  }

  /**
   * Cambia la lingua attiva dell'applicazione e la salva nello store persistito.
   * @param lang Il codice della nuova lingua (deve essere di tipo Language).
   */
  public changeLanguage(lang: Language): void {
    this.persistentSvc.updateSlice(StorageConfig.KEYS.LANGUAGE, lang);
  }

  /**
   * Ottiene la lingua attualmente attiva.
   */
  public getActiveLang(): Language {
    return this.translocoSvc.getActiveLang() as Language;
  }

  /**
   * Ottiene l'elenco delle lingue disponibili.
   */
  public getAvailableLangs(): Language[] {
    return this.translocoSvc.getAvailableLangs() as Language[];
  }
}
