import { Injectable, effect, inject, Signal } from '@angular/core';
import { Theme } from '../types/theme.type';
import { PlatformService } from './platform.service';
import { CookiePersistentService } from './cookie-persistent.service';
import { StorageConfig } from '../constants/storage-keys.const';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private platformSvc = inject(PlatformService);
  private persistentSvc = inject(CookiePersistentService);

  public readonly theme: Signal<Theme> = this.persistentSvc.getSlice(
    StorageConfig.KEYS.THEME
  );

  constructor() {
    effect(() => {
      if (this.platformSvc.isBrowser) {
        this.applyThemeToDocument(this.theme());
      }
    });
  }

  public toggleTheme(): void {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.persistentSvc.updateSlice(StorageConfig.KEYS.THEME, newTheme);
  }

  private applyThemeToDocument(theme: Theme): void {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('light-theme', 'dark-theme');
    htmlElement.classList.add(`${theme}-theme`);
    htmlElement.setAttribute('data-bs-theme', theme);
  }
}
