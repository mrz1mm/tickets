import { isDevMode, makeEnvironmentProviders } from '@angular/core';
import { TRANSLOCO_LOADER, TranslocoLoader } from '@ngneat/transloco';
import { Observable, of } from 'rxjs';

// Mettiamo il loader del server direttamente qui dentro.
class ServerLoader implements TranslocoLoader {
  getTranslation(lang: string): Observable<any> {
    const fs = require('fs');
    const path = require('path');
    const CWD = process.cwd();

    const filePath = isDevMode()
      ? path.join(CWD, 'src', 'assets', 'i18n', `${lang}.json`)
      : path.join(CWD, 'dist/tickets/browser/assets/i18n', `${lang}.json`);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return of(JSON.parse(content));
    } catch (e) {
      console.error(e);
      return of({});
    }
  }
}

export function provideTranslocoServer() {
  return makeEnvironmentProviders([
    {
      provide: TRANSLOCO_LOADER,
      useClass: ServerLoader,
    },
  ]);
}
