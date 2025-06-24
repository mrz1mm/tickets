import { authInterceptor } from './features/auth/interceptor/auth.interceptor';
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
import { notificationInterceptor } from './core/interceptors/notification.interceptor';
import { TranslocoBrowserLoader } from './transloco-browser.loader';
import { ErrorHandlingService } from './core/services/error-handling.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, notificationInterceptor])
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
    { provide: ErrorHandler, useClass: ErrorHandlingService },
  ],
};
