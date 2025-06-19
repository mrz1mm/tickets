import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { filter, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslatedTitleStrategy extends TitleStrategy {
  private translocoSvc = inject(TranslocoService);

  constructor(private readonly title: Title) {
    super();
  }

  /**
   * Sovrascrive il metodo di default per aggiornare il titolo della pagina.
   * Cerca una chiave di traduzione nella proprietà 'data.title' della rotta attiva.
   * @param snapshot Lo snapshot dello stato del router.
   */
  override updateTitle(snapshot: RouterStateSnapshot): void {
    const titleKey = this.buildTitle(snapshot);
    if (titleKey) {
      // Ascolta le traduzioni e imposta il titolo non appena la chiave è disponibile.
      this.translocoSvc
        .selectTranslate(titleKey)
        .pipe(
          filter((translation) => translation !== titleKey), // Aspetta la vera traduzione
          take(1) // Prendi solo la prima emissione per evitare aggiornamenti multipli
        )
        .subscribe((translation) => {
          this.title.setTitle(`${translation} | Tickets App`);
        });
    } else {
      this.title.setTitle('Tickets App'); // Titolo di fallback
    }
  }
}
