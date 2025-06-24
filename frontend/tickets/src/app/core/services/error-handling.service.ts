import { ErrorHandler, inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from './toast.service';
import { ApiResponse } from '../interfaces/api-response.interface';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService implements ErrorHandler {
  private toastSvc = inject(ToastService);
  private translocoSvc = inject(TranslocoService);

  /**
   * Cattura errori globali non gestiti.
   */
  handleError(error: unknown): void {
    console.error('Errore globale non gestito catturato:', error);

    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else if (error instanceof Error) {
      this.handleClientError(error, 'errors.unexpected');
    } else {
      const genericMessage = this.translocoSvc.translate('errors.unexpected');
      this.toastSvc.showError(
        this.translocoSvc.translate('errors.genericTitle'),
        genericMessage
      );
    }
  }

  /**
   * Gestisce errori HTTP, usando il messaggio del backend se disponibile.
   */
  public handleHttpError(error: HttpErrorResponse): void {
    const apiResponse = error.error as ApiResponse<unknown>;
    const userMessage =
      apiResponse?.message || this.translocoSvc.translate('errors.unexpected');
    const errorTitle = `${this.translocoSvc.translate('errors.genericTitle')} ${
      error.status
    }`;

    this.toastSvc.showError(errorTitle, userMessage);
  }

  /**
   * Gestisce errori specifici del client passando una chiave di traduzione.
   * @param error L'oggetto errore originale per il logging.
   * @param translationKey La chiave del messaggio da tradurre (es. 'errors.cookieRead').
   */
  public handleClientError(error: Error, translationKey: string): void {
    console.error(`Errore client gestito [${translationKey}]:`, error);

    const message = this.translocoSvc.translate(translationKey);
    const title = this.translocoSvc.translate('errors.genericTitle');

    this.toastSvc.showError(title, message);
  }
}
