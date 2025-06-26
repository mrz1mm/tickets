import { ErrorHandler, inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from './toast.service';
import { ApiResponse } from '../interfaces/api-response.interface';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class UiNotificationService implements ErrorHandler {
  private toastSvc = inject(ToastService);
  private translocoSvc = inject(TranslocoService);

  // --- METODI PUBBLICI PER EVENTI SPECIFICI ---

  public showSuccess(message: string): void {
    const title = this.translocoSvc.translate('notifications.successTitle');
    this.toastSvc.showSuccess(title, message);
  }

  public showAccessDenied(): void {
    const title = this.translocoSvc.translate('guards.accessDeniedTitle');
    const message = this.translocoSvc.translate('guards.noPermissionsMessage');
    this.toastSvc.showError(title, message);
  }

  // --- METODI PER LA GESTIONE DEGLI ERRORI ---

  /**
   * Gestore per errori HTTP, chiamato dall'interceptor.
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
   * Gestore per errori client, chiamato da try/catch.
   */
  public handleClientError(error: Error, translationKey: string): void {
    console.error(`Errore client gestito [${translationKey}]:`, error);
    const message = this.translocoSvc.translate(translationKey);
    const title = this.translocoSvc.translate('errors.genericTitle');
    this.toastSvc.showError(title, message);
  }

  /**
   * Gestore globale per errori non gestiti.
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
   * Mostra un errore generico per problemi di configurazione o imprevisti.
   */
  public showTechnicalError(): void {
    const title = this.translocoSvc.translate('errors.genericTitle');
    const message = this.translocoSvc.translate('errors.unexpected');
    this.toastSvc.showError(title, message);
  }
}
