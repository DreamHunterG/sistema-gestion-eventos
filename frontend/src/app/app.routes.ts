import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  // 1. Ruta de Login (Sin menú lateral)
  { path: 'login', component: LoginComponent },

  // 2. Rutas Privadas (Todas protegidas por el Layout azul)
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      // Aquí iremos agregando /eventos, /importar, etc.
    ]
  },

  // 3. Redirecciones de seguridad
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
