import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ==========================================
  // 1. ZONA PÚBLICA (LANDING PAGE - Sin Login)
  // ==========================================
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
    title: 'SGE - Acceso'
  },
  {
    path: 'verificar', // 🔑 Esta es tu LANDING PÚBLICA tipo Google
    loadComponent: () => import('./features/verificacion/verificacion.component').then(m => m.VerificacionComponent),
    title: 'SGE - Validación Oficial'
  },

  // ==========================================
  // 2. ZONA PRIVADA (SIDEBAR AZUL - Con Login)
  // ==========================================
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard], // 🛡️ El portero solo deja pasar a admin/monitor
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
        title: 'SGE - Equipo'
      },
      {
        path: 'asistencia',
        loadComponent: () => import('./features/asistencia/asistencia.component').then(m => m.AsistenciaComponent),
        title: 'SGE - Asistencia'
      },
      {
        path: 'escanner',
        loadComponent: () => import('./features/escanner/escanner.component').then(m => m.EscannerComponent),
        title: 'SGE - Escáner QR'
      },
      {
        path: 'validar-interno', // 🔑 Verificación dentro del sistema
        loadComponent: () => import('./features/verificacion/verificacion.component').then(m => m.VerificacionComponent),
        title: 'SGE - Validar Logro'
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ==========================================
  // 3. GESTIÓN DE ERRORES
  // ==========================================
  {
    path: '404',
    loadComponent: () => import('./features/error404/error404.component').then(m => m.Error404Component),
    title: 'SGE - No encontrado'
  },
  { path: '**', redirectTo: '404' }
];
