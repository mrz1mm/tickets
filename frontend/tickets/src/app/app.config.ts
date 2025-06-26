import { authInterceptor } from './features/auth/interceptors/auth.interceptor';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
  ErrorHandler,
} from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideTransloco } from '@ngneat/transloco';
import { TranslatedTitleStrategy } from './core/services/translated-title.strategy';
import { apiMessageInterceptor } from './core/interceptors/api-message.interceptor';
import { TranslocoBrowserLoader } from './transloco-browser.loader';
import { UiNotificationService } from './core/services/ui-notification.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, apiMessageInterceptor])
    ),
    provideTransloco({
      config: {
        availableLangs: ['it', 'en'],
        defaultLang: 'it',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoBrowserLoader,
    }),
    { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
    { provide: ErrorHandler, useClass: UiNotificationService },
  ],
};
