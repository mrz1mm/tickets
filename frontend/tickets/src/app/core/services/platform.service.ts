import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  /**
   * Una proprietà booleana che indica se l'applicazione sta girando
   * in un ambiente browser. Questo valore è calcolato una sola volta
   * e non cambia mai durante il ciclo di vita dell'applicazione.
   */
  public readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
}
