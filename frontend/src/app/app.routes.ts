import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ==========================================
  // 1. ZONA PÚBLICA (LIBRE - Sin Sidebar)
  // ==========================================
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    title: 'SGE - Acceso al Portal'
  },
  {
    path: 'verificar', // 🔑 LANDING PÚBLICA: No tiene canActivate
    loadComponent: () => import('./features/verificacion/verificacion.component').then(m => m.VerificacionComponent),
    title: 'SGE - Validación Oficial'
  },

  // ==========================================
  // 2. ZONA PRIVADA (PROTEGIDA - Con Sidebar)
  // ==========================================
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'SGE - Panel de Control'
      },
      {
        path: 'importar',
        loadComponent: () => import('./features/importar/importar.component').then(m => m.ImportarComponent),
        title: 'SGE - Carga Masiva'
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/usuarios/usuarios.component').then(m => m.UsuariosComponent),
        title: 'SGE - Gestión de Equipo'
      },
      {
        path: 'asistencia',
        loadComponent: () => import('./features/asistencia/asistencia.component').then(m => m.AsistenciaComponent),
        title: 'SGE - Control de Asistencia'
      },
      {
        path: 'escanner',
        loadComponent: () => import('./features/escanner/escanner.component').then(m => m.EscannerComponent),
        title: 'SGE - Escáner QR'
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '404', loadComponent: () => import('./features/error404/error404.component').then(m => m.Error404Component) },
  { path: '**', redirectTo: '404' }
];
