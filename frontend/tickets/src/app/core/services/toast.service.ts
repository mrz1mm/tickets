import { Injectable, signal, WritableSignal } from '@angular/core';
import { ToastMessage } from '../interfaces/toast-message.interface';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly MAX_VISIBLE_TOASTS = 3;

  public toasts: WritableSignal<ToastMessage[]> = signal([]);

  private defaultDuration = 5000;
  private idCounter = 0;

  /**
   * Mostra un nuovo toast di tipo 'success'.
   * @param title Il titolo del messaggio.
   * @param message Il corpo del messaggio (opzionale).
   */
  public showSuccess(title: string, message?: string): void {
    this.addToast({ severity: 'success', title, message });
  }

  /**
   * Mostra un nuovo toast di tipo 'error'.
   * @param title Il titolo del messaggio.
   * @param message Il corpo del messaggio (opzionale).
   */
  public showError(title: string, message?: string): void {
    this.addToast({ severity: 'error', title, message });
  }

  /**
   * Mostra un nuovo toast di tipo 'info'.
   * @param title Il titolo del messaggio.
   * @param message Il corpo del messaggio (opzionale).
   */
  public showInfo(title: string, message?: string): void {
    this.addToast({ severity: 'info', title, message });
  }

  /**
   * Mostra un nuovo toast di tipo 'warning'.
   * @param title Il titolo del messaggio.
   * @param message Il corpo del messaggio (opzionale).
   */
  public showWarning(title: string, message?: string): void {
    this.addToast({ severity: 'warning', title, message });
  }

  /**
   * Aggiunge un nuovo toast all'array, rispettando il limite massimo.
   * I toast più vecchi vengono rimossi per fare spazio ai nuovi.
   * @param toast Il messaggio di toast da aggiungere.
   */
  private addToast(toast: ToastMessage): void {
    const id = this.idCounter++;
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration || this.defaultDuration,
    };

    this.toasts.update((currentToasts) => {
      const newToasts = [newToast, ...currentToasts];
      // Manteniamo solo il numero massimo di toast consentiti
      return newToasts.slice(0, this.MAX_VISIBLE_TOASTS);
    });
  }

  /**
   * Rimuove un toast dall'elenco.
   * @param id L'ID del toast da rimuovere.
   */
  public removeToast(id: number): void {
    this.toasts.update((currentToasts) =>
      currentToasts.filter((t) => t.id !== id)
    );
  }
}
