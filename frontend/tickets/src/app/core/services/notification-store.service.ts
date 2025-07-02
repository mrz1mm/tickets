import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PagedResult } from '../interfaces/paged-result.interface';
import { Notification } from '../interfaces/notification.interface';
import { NotificationState } from '../interfaces/notification-state.interface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationStoreService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/v1/notifications';

  #state = signal<NotificationState>({
    notifications: [],
    totalUnread: 0,
    pageNumber: 0,
    totalPages: 0,
    isLoading: true,
  });

  public readonly notifications = computed(() => this.#state().notifications);
  public readonly totalUnread = computed(() => this.#state().totalUnread);
  public readonly isLoading = computed(() => this.#state().isLoading);

  constructor() {}

  public init(): void {
    this.fetchNotifications();
  }

  public destroy(): void {
    this.#state.set({
      notifications: [],
      totalUnread: 0,
      pageNumber: 0,
      totalPages: 0,
      isLoading: false,
    });
  }

  public fetchNotifications(page = 0): void {
    this.#state.update((s) => ({ ...s, isLoading: true }));
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', '10')
      .set('sort', 'createdAt,desc');

    this.http
      .get<any>(this.API_URL, { params })
      .pipe(
        tap((pagedResult: PagedResult<Notification>) => {
          const unreadCount = pagedResult.content.filter(
            (n) => !n.isRead
          ).length;
          this.#state.set({
            notifications: pagedResult.content,
            totalUnread: unreadCount,
            pageNumber: pagedResult.pageNumber,
            totalPages: pagedResult.totalPages,
            isLoading: false,
          });
        })
      )
      .subscribe();
  }

  public addNotification(notification: Notification): void {
    this.#state.update((state) => ({
      ...state,
      notifications: [notification, ...state.notifications.slice(0, 9)],
      totalUnread: state.totalUnread + 1,
    }));
  }

  public markAsRead(notificationId: number): void {
    const notification = this.#state().notifications.find(
      (n) => n.id === notificationId
    );
    if (notification && !notification.isRead) {
      this.#state.update((s) => ({
        ...s,
        notifications: s.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
        totalUnread: s.totalUnread - 1,
      }));
      this.http
        .post(`${this.API_URL}/${notificationId}/mark-as-read`, {})
        .subscribe();
    }
  }

  public markAllAsRead(): void {
    this.#state.update((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      totalUnread: 0,
    }));
    this.http.post(`${this.API_URL}/mark-all-as-read`, {}).subscribe();
  }
}
