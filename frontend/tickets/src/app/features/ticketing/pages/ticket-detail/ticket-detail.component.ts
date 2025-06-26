import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { TicketService } from '../../services/ticket.service';
import { TranslocoModule } from '@ngneat/transloco';
import { AddComment } from '../../interfaces/add-comment.interface';
import { TicketDetail } from '../../interfaces/ticket-detail.interface';
import { TicketCommentBoxComponent } from '../../components/ticket-comment-box/ticket-comment-box.component';

@Component({
  selector: 'app-ticket-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslocoModule,
    DatePipe,
    TicketCommentBoxComponent,
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss',
})
export class TicketDetailPage {
  private route = inject(ActivatedRoute);
  private ticketSvc = inject(TicketService);

  /**
   * Signal scrivibile che contiene i dati del ticket.
   */
  public ticket = signal<TicketDetail | null | undefined>(undefined);

  /**
   * Signal per gestire lo stato di caricamento durante l'invio di un commento.
   */
  public isSubmittingComment = signal(false);

  constructor() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));
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

  /**
   * Gestisce l'evento emesso dal TicketCommentBoxComponent.
   * Chiama il servizio per aggiungere il commento e aggiorna lo stato del ticket.
   * @param content Il testo del commento da inviare.
   */
  public onCommentSubmit(content: string): void {
    const currentTicket = this.ticket();

    if (!currentTicket) {
      console.error('Tentativo di commentare un ticket non caricato.');
      return;
    }

    this.isSubmittingComment.set(true);

    const commentData: AddComment = { content };

    this.ticketSvc.addComment(currentTicket.id, commentData).subscribe({
      next: (updatedTicket) => {
        if (updatedTicket) {
          this.ticket.set(updatedTicket);
        }
      },
      complete: () => {
        this.isSubmittingComment.set(false);
      },
    });
  }
}
