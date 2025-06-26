import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-ticket-comment-box-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './ticket-comment-box.component.html',
})
export class TicketCommentBoxComponent {
  private fb = inject(FormBuilder);

  /**
   * Input per disabilitare il form mentre un'altra operazione è in corso.
   */
  @Input() isLoading: boolean = false;

  /**
   * Evento emesso quando l'utente invia un commento valido.
   * Il payload è il testo del commento.
   */
  @Output() commentSubmit = new EventEmitter<string>();

  /**
   * Form reattivo per il commento.
   * Il commento non può essere vuoto.
   */
  public commentForm = this.fb.group({
    content: ['', Validators.required],
  });

  /**
   * Gestisce la sottomissione del form.
   * Se valido, emette l'evento `commentSubmit` e resetta il form.
   */
  public onSubmit(): void {
    if (this.commentForm.invalid || this.isLoading) {
      return;
    }

    const content = this.commentForm.value.content;
    if (content) {
      this.commentSubmit.emit(content);
      // Resetta il form dopo l'invio
      this.commentForm.reset();
    }
  }
}
