import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-toaster-container-component',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './toaster-container.component.html',
  styleUrl: './toaster-container.component.scss',
})
export class ToasterContainerComponent {
  public toastSvc = inject(ToastService);

  public isHovered = signal(false);

  /**
   * Calcola lo stile di trasformazione CSS per un singolo toast in base alla sua posizione nello stack.
   * @param index L'indice del toast nell'array (0 è il più recente).
   * @returns Una stringa di trasformazione CSS (es. 'scale(0.9) translateY(10px)').
   */
  public getToastStyle(index: number): string {
    // Definiamo le costanti qui per coerenza con lo SCSS
    const TOAST_HEIGHT = 60; // Altezza di base
    const TOAST_GAP = 30; // Spazio tra i toast

    if (this.isHovered()) {
      // Se siamo in hover, i toast si dispongono verticalmente con un gap.
      const yOffset = index * (TOAST_HEIGHT + TOAST_GAP);
      return `translateY(${yOffset}px)`;
    } else {
      // Se non siamo in hover, i toast si comprimono.
      const scale = 1 - index * 0.05;
      const yOffset = index * 12;
      return `scale(${scale}) translateY(${yOffset}px)`;
    }
  }
}
