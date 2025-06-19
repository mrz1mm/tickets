import {
  Component,
  inject,
  LOCALE_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { TranslocoModule } from '@ngneat/transloco';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage, TranslocoModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public authSvc = inject(AuthService);
  public themeSvc = inject(ThemeService);
  public langSvc = inject(LanguageService);
}
