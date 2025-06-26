import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastMessage } from '../../interfaces/toast-message.interface';

@Component({
  selector: 'app-toast-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input({ required: true }) toast!: ToastMessage;
  @Output() closed = new EventEmitter<number>();

  private timeoutId?: number;

  get toastConfig() {
    const iconMap = {
      success: 'bi-check-circle-fill',
      error: 'bi-x-octagon-fill',
      info: 'bi-info-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
    };
    return { icon: iconMap[this.toast.severity] };
  }

  ngOnInit(): void {
    if (this.toast.duration && this.toast.id !== undefined) {
      this.timeoutId = window.setTimeout(() => {
        this.close();
      }, this.toast.duration);
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  public close(): void {
    if (this.toast.id !== undefined) {
      this.closed.emit(this.toast.id);
    }
  }
}
