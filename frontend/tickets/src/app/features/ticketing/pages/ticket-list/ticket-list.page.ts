import {
  Component,
  OnInit,
  inject,
  signal,
  afterNextRender,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { TicketService } from '../../services/ticket.service';
import { TicketFormComponent } from '../../components/ticket-form/ticket-form.component';
import { Modal } from 'bootstrap';
import { Router } from '@angular/router';
import { Path } from '../../../../core/constants/path.constants.const';
import { Department } from '../../../deapartments/interfaces/department.interface';
import { DepartmentService } from '../../../deapartments/services/department.service';
import { CreateTicket } from '../../interfaces/create-ticket.interface';
import { TicketSummary } from '../../interfaces/ticket-summary.interface';
import { UpdateTicket } from '../../interfaces/update-ticket.interface';

@Component({
  selector: 'app-ticket-list-page',
  standalone: true,
  imports: [CommonModule, TranslocoModule, TicketFormComponent],
  templateUrl: './ticket-list.page.html',
})
export class TicketListPage implements OnInit {
  private ticketSvc = inject(TicketService);
  private departmentSvc = inject(DepartmentService);
  private router = inject(Router);
  public tickets = signal<TicketSummary[]>([]);
  public isLoadingTickets = signal(true);
  public ticketsError = signal<string | null>(null);
  public departments = signal<Department[]>([]);
  public departmentsError = signal<string | null>(null);
  public isSaving = signal(false);
  private ticketModal: Modal | undefined;

  constructor() {
    afterNextRender(() => {
      const modalElement = document.getElementById('ticketFormModal');
      if (modalElement) {
        this.ticketModal = new Modal(modalElement);
      }
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  private loadDepartments(): void {
    this.departmentsError.set(null);
    this.departmentSvc.getDepartments().subscribe({
      next: (data) => this.departments.set(data),
      error: () => {
        this.departmentsError.set('Impossibile caricare i dipartimenti.');
      },
    });
  }

  /**
   * Apre la modale per la creazione di un nuovo ticket.
   */
  public openCreateTicketModal(): void {
    this.ticketModal?.show();
  }

  /**
   * Chiude la modale.
   */
  public closeModal(): void {
    this.ticketModal?.hide();
  }

  /**
   * Gestisce l'evento 'save' dal form.
   * @param ticketData I dati del ticket da creare.
   */
  public onSaveTicket(ticketData: CreateTicket | UpdateTicket): void {
    this.isSaving.set(true);
    this.ticketSvc.createTicket(ticketData as CreateTicket).subscribe({
      next: (newTicket) => {
        this.isSaving.set(false);
        this.closeModal();
        this.router.navigate([Path.TICKETS.BASE, newTicket?.id]);
      },
      error: () => {
        this.isSaving.set(false);
      },
    });
  }
}
