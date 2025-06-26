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

  @Input() isLoading: boolean = false;

  @Output() commentSubmit = new EventEmitter<string>();

  public commentForm = this.fb.group({
    content: ['', Validators.required],
  });

  public onSubmit(): void {
    if (this.commentForm.invalid || this.isLoading) {
      return;
    }

    const content = this.commentForm.value.content;
    if (content) {
      this.commentSubmit.emit(content);
      this.commentForm.reset();
    }
  }
}
