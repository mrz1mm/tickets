import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { ServerLoader } from './server.loader';
import { TRANSLOCO_LOADER } from '@ngneat/transloco';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    { provide: TRANSLOCO_LOADER, useClass: ServerLoader },
  ],
};
export const config = mergeApplicationConfig(appConfig, serverConfig);
