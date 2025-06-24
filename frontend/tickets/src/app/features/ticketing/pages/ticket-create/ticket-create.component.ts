import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TicketService } from '../../services/ticket.service';
import { CreateTicket } from '../../interfaces/create-ticket.interface';
import { TranslocoModule } from '@ngneat/transloco';
import { DepartmentService } from '../../../deapartments/services/department.service';
import { TicketPriority } from '../../interfaces/ticket-priority.type';

// Definiamo un tipo per il nostro form per una maggiore sicurezza
interface TicketForm {
  title: FormControl<string>;
  description: FormControl<string>;
  departmentId: FormControl<number | null>;
  priority: FormControl<TicketPriority>;
}

@Component({
  selector: 'app-ticket-create-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslocoModule],
  templateUrl: './ticket-create.component.html',
})
export class TicketCreateComponent {
  private fb = inject(FormBuilder).nonNullable;
  private ticketSvc = inject(TicketService);
  private departmentSvc = inject(DepartmentService);
  private router = inject(Router);

  public departments = toSignal(this.departmentSvc.getAll());
  public priorities: TicketPriority[] = ['BASSA', 'MEDIA', 'ALTA', 'URGENTE'];
  public isSubmitting = signal(false);

  public ticketForm = this.fb.group<TicketForm>({
    title: this.fb.control('', [Validators.required, Validators.minLength(10)]),
    description: this.fb.control('', [
      Validators.required,
      Validators.minLength(20),
    ]),
    departmentId: this.fb.control(null, [Validators.required]),
    priority: this.fb.control('MEDIA', [Validators.required]),
  });

  public onSubmit(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    // getRawValue() con un form tipizzato ci dà un oggetto corretto
    const formData = this.ticketForm.getRawValue() as CreateTicket;

    this.ticketSvc.createTicket(formData).subscribe({
      next: (newTicket) => {
        if (newTicket) {
          // Successo: il servizio o l'intercettore ha già mostrato il toast.
          // Navighiamo alla pagina di dettaglio del nuovo ticket.
          this.router.navigate(['/tickets', newTicket.id]);
        }
      },
      complete: () => {
        this.isSubmitting.set(false);
      },
    });
  }
}
