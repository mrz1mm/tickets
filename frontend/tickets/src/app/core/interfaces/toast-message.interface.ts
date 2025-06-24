import { ToastSeverity } from '../types/toast.type';

export interface ToastMessage {
  id?: number;
  severity: ToastSeverity;
  title: string;
  message?: string;
  duration?: number;
}
