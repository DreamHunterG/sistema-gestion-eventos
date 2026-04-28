import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ==========================================
  // 1. ZONA PÚBLICA (Sin Sidebar ni Seguridad)
  // ==========================================
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    title: 'SGE - Acceso al Portal'
  },
  {
    path: 'validar-logro/:hash',
    loadComponent: () => import('./features/verificacion/verificacion.component').then(m => m.VerificacionComponent),
    title: 'SGE - Validar Certificado'
  },

  // ==========================================
  // 2. ZONA PRIVADA (Con Sidebar y Protegida)
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
      // 🔑 RUTA DE ASISTENCIA INTEGRADA:
      {
        path: 'asistencia',
        loadComponent: () => import('./features/asistencia/asistencia.component').then(m => m.AsistenciaComponent),
        title: 'SGE - Control de Asistencia'
      },
      // Redirección por defecto al entrar al sistema
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ==========================================
  // 3. GESTIÓN DE ERRORES Y COMODÍN
  // ==========================================
  {
    path: '404',
    loadComponent: () => import('./features/error404/error404.component').then(m => m.Error404Component),
    title: 'SGE - Enlace no disponible'
  },
  { path: '**', redirectTo: 'login' }
];
