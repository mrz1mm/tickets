import { TranslocoLoader } from '@ngneat/transloco';
import { join } from 'path';
import { readFileSync } from 'fs';

export class ServerLoader implements TranslocoLoader {
  getTranslation(lang: string): any {
    const path = join(
      process.cwd(),
      'dist/tickets/browser/assets/i18n',
      `${lang}.json`
    );
    const data = readFileSync(path, 'utf8');
    return JSON.parse(data);
  }
}
