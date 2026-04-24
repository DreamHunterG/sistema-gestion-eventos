import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ==========================================
  // 1. ZONA PÚBLICA (Sin Sidebar azul)
  // ==========================================
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    title: 'SGE - Acceso al Portal'
  },

  // HU-25: Ruta pública de verificación (Auditoría externa)
  {
    path: 'validar-logro/:hash',
    loadComponent: () => import('./features/verificacion/verificacion.component').then(m => m.VerificacionComponent),
    title: 'SGE - Validar Certificado'
  },

  // ==========================================
  // 2. ZONA PRIVADA (Protegida por Layout y Guard)
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
      // Ruta por defecto al estar logueado
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ==========================================
  // 3. GESTIÓN DE ERRORES
  // ==========================================
  {
    path: '404',
    loadComponent: () => import('./features/error404/error404.component').then(m => m.Error404Component),
    title: 'SGE - Enlace no disponible'
  },
  { path: '**', redirectTo: 'login' }
];
