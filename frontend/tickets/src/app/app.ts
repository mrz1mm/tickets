import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { CookiesComponent } from './layout/cookies/cookies.component';
import { NgxSonnerToaster, ToasterProps } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CookiesComponent, TranslocoModule, NgxSonnerToaster],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'tickets';
}
