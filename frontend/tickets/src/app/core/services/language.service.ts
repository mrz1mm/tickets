import { Injectable, inject, WritableSignal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { CookiePersistentService } from './cookie-persistent.service';
import { StorageConfig } from '../enums/storage-keys.enum';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translocoSvc = inject(TranslocoService);
  private persistentSvc = inject(CookiePersistentService);

  private persistedLang: WritableSignal<string>;

  constructor() {
    this.persistedLang = this.persistentSvc.PSignal<string>(
      StorageConfig.KEYS.LANGUAGE,
      this.translocoSvc.getDefaultLang()
    );
    this.translocoSvc.setActiveLang(this.persistedLang());
  }

  /**
   * Cambia la lingua attiva dell'applicazione e la salva nel cookie.
   * @param lang Il codice della nuova lingua (es. 'en', 'it').
   */
  public changeLanguage(lang: string): void {
    this.translocoSvc.setActiveLang(lang);
    this.persistedLang.set(lang);
  }

  /**
   * Ottiene la lingua attualmente attiva.
   */
  public getActiveLang(): string {
    return this.translocoSvc.getActiveLang();
  }

  /**
   * Ottiene l'elenco delle lingue disponibili.
   */
  public getAvailableLangs(): string[] {
    return this.translocoSvc.getAvailableLangs() as string[];
  }
}
