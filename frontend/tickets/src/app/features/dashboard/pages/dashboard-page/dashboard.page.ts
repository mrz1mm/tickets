import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { TicketService } from '../../../ticketing/services/ticket.service';
import { PagedResult } from '../../../../core/interfaces/paged-result.interface';
import { TicketSummary } from '../../../ticketing/interfaces/ticket-summary.interface';
import { TicketTableComponent } from '../../../ticketing/components/ticket-table/ticket-table.component';
import { PaginationComponent } from '../../../../core/components/pagination/pagination.component';
import { Pageable } from '../../../../core/interfaces/pageable.interface';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    TicketTableComponent,
    PaginationComponent,
  ],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit {
  private ticketSvc = inject(TicketService);

  public pagedResult = signal<PagedResult<TicketSummary> | null>(null);
  public isLoading = signal(true);
  public error = signal<string | null>(null);

  private currentPage = 0;
  private pageSize = 10;

  ngOnInit(): void {
    this.loadAssignedTickets();
  }

  public loadAssignedTickets(): void {
    this.isLoading.set(true);
    this.error.set(null);
    const pageable: Pageable = { page: this.currentPage, size: this.pageSize };

    this.ticketSvc.getAssignedToMeTickets(pageable).subscribe({
      next: (data) => {
        this.pagedResult.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Impossibile caricare i ticket assegnati.');
        this.isLoading.set(false);
      },
    });
  }

  public onPageChange(page: number): void {
    this.currentPage = page - 1; // Il backend è 0-based, il componente 1-based
    this.loadAssignedTickets();
  }
}
