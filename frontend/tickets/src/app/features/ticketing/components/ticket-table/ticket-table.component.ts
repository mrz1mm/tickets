import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { TicketSummary } from '../../interfaces/ticket-summary.interface';

@Component({
  selector: 'app-ticket-table-component',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, DatePipe],
  templateUrl: './ticket-table.component.html',
  styleUrl: './ticket-table.component.scss',
})
export class TicketTableComponent {
  @Input() tickets: TicketSummary[] = [];
  @Input() isLoading = false;
  @Input() error: string | null = null;
  @Output() view = new EventEmitter<number>();

  constructor(private router: Router) {}

  public onView(ticketId: number): void {
    this.router.navigate(['/tickets', ticketId]);
  }
}
