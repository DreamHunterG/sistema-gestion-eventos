import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // 1. ZONA PÚBLICA (Sin Sidebar - Para participantes externos)
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    title: 'SGE - Acceso'
  },
  {
    path: 'validar-logro/:hash',
    loadComponent: () => import('./features/verificacion/verificacion.component').then(m => m.VerificacionComponent),
    title: 'SGE - Validar Certificado'
  },

  // 2. ZONA PRIVADA (Protegida y con Sidebar)
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
      // 🔑 MOVIDO AQUÍ: Ahora el escáner tendrá Sidebar y pedirá Login
      {
        path: 'escanner',
        loadComponent: () => import('./features/escanner/escanner.component').then(m => m.EscannerComponent),
        title: 'SGE - Escáner QR'
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
