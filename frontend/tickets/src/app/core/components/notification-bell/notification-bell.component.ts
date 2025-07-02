import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationStoreService } from '../../services/notification-store.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss'],
})
export class NotificationBellComponent {
  @Output() bellClick = new EventEmitter<void>();
  public store = inject(NotificationStoreService);

  get unreadCountDisplay(): string {
    const count = this.store.totalUnread();
    if (count > 99) return '99+';
    return count.toString();
  }
}
