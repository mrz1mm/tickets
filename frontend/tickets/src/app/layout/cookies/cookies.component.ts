import { Component, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CookiePreferenceService } from '../../core/services/cookie-preference.service';
import { PlatformService } from '../../core/services/platform.service';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss',
})
export class CookiesComponent {
  private cookieSvc = inject(CookiePreferenceService);
  private platformSvc = inject(PlatformService);

  public showBanner: WritableSignal<boolean> = signal(false);

  constructor() {
    if (this.platformSvc.isBrowser) {
      const preferences = this.cookieSvc.cookiePreferences();
      if (preferences === null) {
        this.showBanner.set(true);
      }
    }
  }

  /**
   * Gestisce il click sul pulsante "Accetta Tutti".
   */
  public onAcceptAll(): void {
    this.cookieSvc.acceptAll();
    this.showBanner.set(false);
  }

  /**
   * Gestisce il click sul pulsante "Rifiuta Tutti".
   */
  public onRejectAll(): void {
    this.cookieSvc.rejectAll();
    this.showBanner.set(false);
  }
}
