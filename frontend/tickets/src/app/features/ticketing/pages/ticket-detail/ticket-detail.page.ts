import {
  Component,
  inject,
  signal,
  afterNextRender,
  computed,
  Signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { TicketService } from '../../services/ticket.service';
import { TranslocoModule } from '@ngneat/transloco';
import { AddComment } from '../../interfaces/add-comment.interface';
import { TicketDetail } from '../../interfaces/ticket-detail.interface';
import { TicketCommentBoxComponent } from '../../components/ticket-comment-box/ticket-comment-box.component';
import { TicketFormComponent } from '../../components/ticket-form/ticket-form.component';
import { UpdateTicket } from '../../interfaces/update-ticket.interface';
import { Department } from '../../../deapartments/interfaces/department.interface';
import { DepartmentService } from '../../../deapartments/services/department.service';
import { Modal } from 'bootstrap';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-ticket-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslocoModule,
    DatePipe,
    TicketCommentBoxComponent,
    TicketFormComponent,
  ],
  templateUrl: './ticket-detail.page.html',
  styleUrl: './ticket-detail.page.scss',
})
export class TicketDetailPage {
  private route = inject(ActivatedRoute);
  private ticketSvc = inject(TicketService);
  private departmentSvc = inject(DepartmentService);
  private authSvc = inject(AuthService);

  public ticket = signal<TicketDetail | null>(null);
  public departments = signal<Department[]>([]);
  public isSubmittingComment = signal(false);
  public isSaving = signal(false);
  private editModal: Modal | undefined;

  public canEdit: Signal<boolean> = computed(() => {
    const currentUser = this.authSvc.currentUser();
    const currentTicket = this.ticket();
    if (!currentUser || !currentTicket) return false;

    const hasGlobalPermission = this.authSvc.hasPermission('TICKET_UPDATE_ALL');
    if (hasGlobalPermission) return true;

    const isOwner = currentUser.id === currentTicket.requester.id;
    const isAssignee = currentTicket.assignee
      ? currentUser.id === currentTicket.assignee.id
      : false;

    return isOwner || isAssignee;
  });

  constructor() {
    this.loadTicket();
    this.loadDepartments();

    afterNextRender(() => {
      const modalElement = document.getElementById('editTicketModal');
      if (modalElement) {
        this.editModal = new Modal(modalElement);
      }
    });
  }

  private loadTicket(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('ticketId'));
          if (isNaN(id)) {
            this.ticket.set(null);
            return [];
          }
          return this.ticketSvc.getTicketById(id);
        })
      )
      .subscribe((ticketData) => {
        this.ticket.set(ticketData);
      });
  }

  private loadDepartments(): void {
    this.departmentSvc
      .getDepartments()
      .subscribe((data) => this.departments.set(data));
  }

  public onCommentSubmit(content: string): void {
    const currentTicket = this.ticket();
    if (!currentTicket) return;

    this.isSubmittingComment.set(true);
    const commentData: AddComment = { content };

    this.ticketSvc.addComment(currentTicket.id, commentData).subscribe({
      next: (updatedTicket) => {
        if (updatedTicket) this.ticket.set(updatedTicket);
      },
      complete: () => this.isSubmittingComment.set(false),
    });
  }

  public onSaveTicket(ticketData: UpdateTicket): void {
    const currentTicket = this.ticket();
    if (!currentTicket) return;

    this.isSaving.set(true);
    this.ticketSvc.updateTicket(currentTicket.id, ticketData).subscribe({
      next: (updatedTicket) => {
        this.ticket.set(updatedTicket);
        this.closeModal();
      },
      complete: () => this.isSaving.set(false),
    });
  }

  public openEditModal(): void {
    this.editModal?.show();
  }

  public closeModal(): void {
    this.editModal?.hide();
  }
}
