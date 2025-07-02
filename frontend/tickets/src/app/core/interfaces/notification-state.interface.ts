import { Notification } from './notification.interface';

export interface NotificationState {
  notifications: Notification[];
  totalUnread: number;
  pageNumber: number;
  totalPages: number;
  isLoading: boolean;
}
