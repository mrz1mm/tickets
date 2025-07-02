import {
  Component,
  inject,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { TranslocoModule } from '@ngneat/transloco';
import { LanguageService } from '../../core/services/language.service';
import { NotificationBellComponent } from '../../core/components/notification-bell/notification-bell.component';
import { NotificationPanelComponent } from '../../core/components/notification-panel/notification-panel.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    TranslocoModule,
    NotificationBellComponent,
    NotificationPanelComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public authSvc = inject(AuthService);
  public themeSvc = inject(ThemeService);
  public langSvc = inject(LanguageService);
  public showNotifications = signal(false);
}
