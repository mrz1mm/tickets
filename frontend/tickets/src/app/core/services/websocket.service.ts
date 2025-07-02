import { inject, Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from '../../features/auth/services/auth.service';
import { NotificationStoreService } from './notification-store.service';
import { Notification } from '../interfaces/notification.interface';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Client | null = null;
  private authSvc = inject(AuthService);
  private notificationStore = inject(NotificationStoreService);

  public connect(): void {
    if (this.stompClient?.active || !this.authSvc.currentUser()) return;

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      this.stompClient?.subscribe(
        `/user/queue/notifications`,
        (message: IMessage) => {
          this.onMessageReceived(message);
        }
      );
    };

    this.stompClient.activate();
  }

  public disconnect(): void {
    this.stompClient?.deactivate();
    this.stompClient = null;
  }

  private onMessageReceived(message: IMessage): void {
    try {
      const notification: Notification = JSON.parse(message.body);
      this.notificationStore.addNotification(notification);
    } catch (error) {
      console.error('Errore nel parsing della notifica WebSocket:', error);
    }
  }
}
