import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { Observable, of } from 'rxjs';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable({ providedIn: 'root' })
export class TranslocoServerLoader implements TranslocoLoader {
  getTranslation(lang: string): Observable<Translation> {
    const distFolder = join(process.cwd(), 'dist/tickets/browser');
    const path = join(distFolder, 'assets/i18n', `${lang}.json`);
    const translation = JSON.parse(readFileSync(path, 'utf8'));
    return of(translation);
  }
}
