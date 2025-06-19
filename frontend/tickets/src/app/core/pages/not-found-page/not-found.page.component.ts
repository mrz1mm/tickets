import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  standalone: true,
  imports: [RouterModule, TranslocoModule],
  template: `
    <div class="text-center mt-5" *transloco="let t">
      <h1>{{ t('notFound.title') }}</h1>
      <p>{{ t('notFound.message') }}</p>
      <a routerLink="/" class="btn btn-primary">{{ t('notFound.button') }}</a>
    </div>
  `,
})
export class NotFoundPageComponent {}
