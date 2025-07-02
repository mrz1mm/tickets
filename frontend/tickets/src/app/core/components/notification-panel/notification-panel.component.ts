import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

import { Path } from '../../../core/constants/path.constants.const';
import { Notification } from '../../../core/interfaces/notification.interface';
import { NotificationStoreService } from '../../services/notification-store.service';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslocoModule],
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
})
export class NotificationPanelComponent {
  @Output() close = new EventEmitter<void>();
  public store = inject(NotificationStoreService);
  private router = inject(Router);

  onNotificationClick(notification: Notification): void {
    this.store.markAsRead(notification.id);
    if (notification.ticket) {
      this.router.navigate([Path.TICKETS.BASE, notification.ticket.id]);
    }
    this.close.emit();
  }

  onMarkAllAsRead(): void {
    this.store.markAllAsRead();
  }
}
