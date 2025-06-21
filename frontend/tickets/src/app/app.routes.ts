import { Routes } from '@angular/router';

// Layout
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { Path } from './core/constants/path.constants';

// N.B: Non ci sono più import di componenti di pagina qui!

export const routes: Routes = [
  // --- Rotte senza Layout (Lazy Loaded) ---
  {
    path: Path.AUTH.LOGIN,
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: Path.AUTH.REGISTER,
    loadComponent: () =>
      import('./features/auth/pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  // --- Rotte con Layout (Lazy Loaded) ---
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: Path.DASHBOARD,
        loadComponent: () =>
          import(
            './features/dashboard/pages/dashboard-page/dashboard.component'
          ).then((m) => m.DashboardComponent),
      },
      {
        path: Path.PROFILE,
        loadComponent: () =>
          import(
            './features/profile/pages/profile-page/profile-page.component'
          ).then((m) => m.ProfilePageComponent),
      },
      {
        path: Path.PRIVACY_POLICY,
        loadComponent: () =>
          import(
            './features/legal/pages/privacy-policy-page/privacy-policy-page.component'
          ).then((m) => m.PrivacyPolicyPageComponent),
      },
      { path: '', redirectTo: Path.DASHBOARD, pathMatch: 'full' },
    ],
  },

  // --- Fallback (Lazy Loaded) ---
  {
    path: Path.NOT_FOUND,
    loadComponent: () =>
      import('./core/pages/not-found-page/not-found.page.component').then(
        (m) => m.NotFoundPageComponent
      ),
  },
];
