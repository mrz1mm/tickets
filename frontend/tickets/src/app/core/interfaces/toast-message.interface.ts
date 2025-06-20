import { ToastSeverity } from './toast.types';

export interface ToastMessage {
  id?: number;
  severity: ToastSeverity;
  title: string;
  message?: string;
  duration?: number;
}
