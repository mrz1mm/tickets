export interface Notification {
  id: number;
  user: { id: number };
  ticket: { id: number } | null;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
