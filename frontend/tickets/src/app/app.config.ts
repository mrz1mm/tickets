import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@ngneat/transloco';
import { TranslatedTitleStrategy } from './core/services/translated-title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideTransloco({
      config: {
        // Le lingue che la nostra app supporta
        availableLangs: ['it', 'en'],
        // La lingua da usare se quella richiesta non è disponibile
        defaultLang: 'it',
        // In un'architettura standalone, questa opzione è FONDAMENTALE.
        // Forza il rerendering dei componenti quando la lingua cambia,
        // aggiornando così la UI che usa la pipe | transloco.
        reRenderOnLangChange: true,
        // Ottimizzazioni per l'ambiente di produzione
        prodMode: !isDevMode(),
      },
      // Specifichiamo quale loader usare per caricare i file di traduzione.
      loader: TranslocoHttpLoader,
    }),

    // Sovrascrivi la strategia di default per i titoli (lo faremo tra poco)
    { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
  ],
};
