import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { TicketSummary } from '../../interfaces/ticket-summary.interface';

@Component({
  selector: 'app-ticket-table',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, DatePipe],
  templateUrl: './ticket-table.component.html',
  styleUrl: './ticket-table.component.scss',
})
export class TicketTableComponent {
  @Input() tickets: TicketSummary[] = [];
}
