import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { TranslocoModule } from '@ngneat/transloco';
import { switchMap } from 'rxjs';
import { Pageable } from '../../../../core/interfaces/pageable.interface';
import { TicketService } from '../../services/ticket.service';
import { TicketTableComponent } from '../../components/ticket-table/ticket-table.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-ticket-list-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    TicketTableComponent,
    PaginationComponent,
  ],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.scss',
})
export class TicketListComponent {
  private ticketSvc = inject(TicketService);

  /**
   * Signal che tiene traccia della configurazione di paginazione corrente.
   */
  public pageable = signal<Pageable>({
    page: 0,
    size: 10,
    sort: 'createdAt,desc',
  });

  /**
   * Signal che contiene il risultato paginato dei ticket.
   * È derivato da un Observable che reagisce ai cambiamenti di `pageable`.
   */
  private ticketsResult$ = toObservable(this.pageable).pipe(
    switchMap((p) => this.ticketSvc.getTickets(p))
  );

  public ticketsResult = toSignal(this.ticketsResult$);

  /**
   * Gestisce l'evento di cambio pagina dal componente di paginazione.
   * @param newPage Il nuovo numero di pagina (basato su 1, lo convertiamo a 0).
   */
  public onPageChange(newPage: number): void {
    this.pageable.update((p) => ({ ...p, page: newPage - 1 }));
  }
}
