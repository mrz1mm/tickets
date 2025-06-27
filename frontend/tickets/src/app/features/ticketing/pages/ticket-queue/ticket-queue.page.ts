import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { TicketService } from '../../services/ticket.service';
import { PagedResult } from '../../../../core/interfaces/paged-result.interface';
import { TicketSummary } from '../../interfaces/ticket-summary.interface';
import { TicketTableComponent } from '../../components/ticket-table/ticket-table.component';
import { PaginationComponent } from '../../../../core/components/pagination/pagination.component';
import { Pageable } from '../../../../core/interfaces/pageable.interface';

@Component({
  selector: 'app-ticket-queue-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    TicketTableComponent,
    PaginationComponent,
  ],
  templateUrl: './ticket-queue.page.html',
})
export class TicketQueuePage implements OnInit {
  private ticketSvc = inject(TicketService);

  public pagedResult = signal<PagedResult<TicketSummary> | null>(null);
  public isLoading = signal(true);
  public error = signal<string | null>(null);

  private currentPage = 0;
  private pageSize = 10;

  ngOnInit(): void {
    this.loadUnassignedTickets();
  }

  public loadUnassignedTickets(): void {
    this.isLoading.set(true);
    this.error.set(null);
    const pageable: Pageable = { page: this.currentPage, size: this.pageSize };

    this.ticketSvc.getUnassignedTickets(pageable).subscribe({
      next: (data) => {
        this.pagedResult.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Impossibile caricare i ticket non assegnati.');
        this.isLoading.set(false);
      },
    });
  }

  public onPageChange(page: number): void {
    this.currentPage = page - 1;
    this.loadUnassignedTickets();
  }
}
