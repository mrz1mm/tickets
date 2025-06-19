import { inject, Injectable, PLATFORM_ID, isDevMode } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  /**
   * Carica un file di traduzione in modo isomorfo (funziona su server e client).
   * @param lang Il codice della lingua da caricare (es. 'en', 'it').
   * @returns Un Observable che emette l'oggetto di traduzione.
   */
  getTranslation(lang: string): Observable<Translation> {
    if (isPlatformServer(this.platformId)) {
      return this.getTranslationForServer(lang);
    }
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }

  /**
   * Logica di caricamento specifica per l'ambiente server (SSR).
   * Ora è consapevole della differenza tra sviluppo e produzione.
   * @param lang Il codice della lingua da caricare.
   * @returns Un Observable che emette l'oggetto di traduzione.
   */
  private getTranslationForServer(lang: string): Observable<Translation> {
    return new Observable((observer) => {
      const CWD = process.cwd();
      let path: string;

      // --- INIZIO MODIFICA ---

      // Se siamo in modalità sviluppo (`ng serve`)...
      if (isDevMode()) {
        // ...il percorso punta direttamente alla cartella 'src/assets'.
        path = `${CWD}/src/assets/i18n/${lang}.json`;
        console.log(`[Transloco Server Loader - DEV MODE] Loading: ${path}`);
      }
      // Altrimenti (siamo in una build di produzione, es. `ng build`)...
      else {
        // ...il percorso punta alla cartella 'dist', come prima.
        path = `${CWD}/dist/tickets/browser/assets/i18n/${lang}.json`;
        console.log(`[Transloco Server Loader - PROD MODE] Loading: ${path}`);
      }

      // --- FINE MODIFICA ---

      // `import()` dinamico per usare moduli Node.js solo sul server.
      import('fs').then((fs) => {
        fs.readFile(path, 'utf8', (err, data) => {
          if (err) {
            console.error(
              `[Transloco Server Loader] ERROR reading file: ${path}`,
              err
            );
            observer.error(err);
          } else {
            observer.next(JSON.parse(data));
            observer.complete();
          }
        });
      });
    });
  }
}
