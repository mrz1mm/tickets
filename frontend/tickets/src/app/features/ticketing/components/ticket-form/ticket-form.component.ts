import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { TicketPriority } from '../../types/ticket-priority.type';
import { Department } from '../../../department/interfaces/department.interface';
import { CreateTicket } from '../../interfaces/create-ticket.interface';
import { TicketDetail } from '../../interfaces/ticket-detail.interface';
import { UpdateTicket } from '../../interfaces/update-ticket.interface';

@Component({
  selector: 'app-ticket-form-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './ticket-form.component.html',
})
export class TicketFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() departments: Department[] = [];
  @Input() isSaving: boolean = false;
  @Input() priorities: TicketPriority[] = ['BASSA', 'MEDIA', 'ALTA', 'URGENTE'];
  @Input() ticket: TicketDetail | null = null;

  @Output() save = new EventEmitter<CreateTicket | UpdateTicket>();
  @Output() closeModal = new EventEmitter<void>();

  public ticketForm: FormGroup;
  public isEditMode = false;

  constructor() {
    this.ticketForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(255),
        ],
      ],
      description: ['', [Validators.required]],
      departmentId: [null, [Validators.required]],
      priority: ['BASSA', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticket'] && this.ticket) {
      // Modalità Modifica
      this.isEditMode = true;
      this.ticketForm.patchValue({
        title: this.ticket.title,
        description: this.ticket.description,
        departmentId: this.ticket.department.id,
        priority: this.ticket.priority,
      });
    } else if (changes['ticket'] && !this.ticket) {
      this.isEditMode = false;
      this.ticketForm.reset({
        priority: 'BASSA',
      });
    }
  }

  public onSubmit(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }
    this.save.emit(this.ticketForm.value);
  }

  public onCancel(): void {
    this.closeModal.emit();
  }
}
