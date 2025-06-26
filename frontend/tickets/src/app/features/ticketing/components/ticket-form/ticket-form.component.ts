import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { TicketPriority } from '../../types/ticket-priority.type';
import { Department } from '../../../deapartments/interfaces/department.interface';
import { CreateTicket } from '../../interfaces/create-ticket.interface';

@Component({
  selector: 'app-ticket-form-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  templateUrl: './ticket-form.component.html',
})
export class TicketFormComponent {
  private fb = inject(FormBuilder);

  @Input() departments: Department[] = [];
  @Input() isSaving: boolean = false;
  @Input() priorities: TicketPriority[] = ['BASSA', 'MEDIA', 'ALTA', 'URGENTE'];

  @Output() save = new EventEmitter<CreateTicket>();
  @Output() closeModal = new EventEmitter<void>();

  public ticketForm: FormGroup;

  constructor() {
    // La definizione del form è già corretta
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
    });
  }

  // Il metodo onSubmit ora emette solo un evento
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
