import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { Path } from './core/constants/path.constants.const';
import { authGuard } from './features/auth/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  // --- Rotte senza Layout ---
  {
    path: Path.AUTH.LOGIN,
    loadComponent: () =>
      import('./features/auth/pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: Path.AUTH.REGISTER,
    loadComponent: () =>
      import('./features/auth/pages/register/register.page').then(
        (m) => m.RegisterPage
      ),
  },

  // --- Rotte con Layout ---
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: Path.DASHBOARD,
        pathMatch: 'full',
      },
      {
        path: Path.DASHBOARD,
        loadComponent: () =>
          import(
            './features/dashboard/pages/dashboard-page/dashboard.page'
          ).then((m) => m.DashboardPage),
      },
      {
        path: Path.DEPARTMENTS,
        canActivate: [permissionGuard],
        data: {
          requiredPermission: 'DEPARTMENT_WRITE',
        },
        loadComponent: () =>
          import(
            './features/admin/departments/pages/department-list/department-list.component'
          ).then((m) => m.DepartmentListComponent),
      },
      {
        path: Path.PROFILE,
        loadComponent: () =>
          import('./features/profile/pages/profile-page/profile.page').then(
            (m) => m.ProfilePage
          ),
      },
      {
        path: Path.PRIVACY_POLICY,
        loadComponent: () =>
          import(
            './features/legal/pages/privacy-policy-page/privacy-policy.page'
          ).then((m) => m.PrivacyPolicyPage),
      },
      {
        path: Path.TICKETS.BASE,
        loadComponent: () =>
          import(
            './features/ticketing/pages/ticket-list/ticket-list.page'
          ).then((m) => m.TicketListPage),
      },
      // NUOVA ROTTA
      {
        path: Path.TICKETS.QUEUE,
        canActivate: [permissionGuard],
        data: {
          requiredPermission: 'TICKET_ASSIGN',
        },
        loadComponent: () =>
          import(
            './features/ticketing/pages/ticket-queue/ticket-queue.page'
          ).then((m) => m.TicketQueuePage),
      },
      {
        path: Path.TICKETS.DETAIL,
        loadComponent: () =>
          import(
            './features/ticketing/pages/ticket-detail/ticket-detail.page'
          ).then((m) => m.TicketDetailPage),
      },
    ],
  },

  // --- Fallback ---
  {
    path: Path.NOT_FOUND,
    loadComponent: () =>
      import('./core/pages/not-found-page/not-found.page.page').then(
        (m) => m.NotFoundPage
      ),
  },
];
