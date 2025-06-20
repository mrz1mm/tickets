import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './features/auth/guard/auth.guard';
import { publicGuard } from './features/auth/guard/public.guard';
import { PathConstants } from './core/constants/path.constants';

export const routes: Routes = [
  // --- Rotte Pubbliche (Login, Registrazione, etc.) ---
  {
    path: PathConstants.AUTH.BASE,
    canActivate: [publicGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
    title: 'titles.auth',
  },

  // --- Rotte Private e Pubbliche con Layout ---
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      // Pagina principale (Dashboard) - Protetta
      {
        path: '',
        pathMatch: 'full',
        canActivate: [authGuard],
        loadComponent: () =>
          import(
            './features/dashboard/pages/dashboard-page/dashboard-page-component'
          ).then((m) => m.DashboardPageComponent),
        title: 'titles.dashboard',
      },

      // Pagina Profilo - Protetta
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import(
            './features/profile/pages/profile-page/profile-page.component'
          ).then((m) => m.ProfilePageComponent),
        title: 'titles.profile',
      },

      // Pagina Privacy Policy - Pubblica ma con layout
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import(
            './features/legal/pages/privacy-policy-page/privacy-policy-page.component'
          ).then((m) => m.PrivacyPolicyPageComponent),
        title: 'titles.privacyPolicy',
      },
    ],
  },

  // --- Rotta di Fallback (Pagina Non Trovata) ---
  {
    path: '**',
    loadComponent: () =>
      import('./core/pages/not-found-page/not-found.page.component').then(
        (m) => m.NotFoundPageComponent
      ),
    title: 'titles.notFound',
  },
];
