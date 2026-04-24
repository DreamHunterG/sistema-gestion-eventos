import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('sge_token');

  console.log('🔍 Portero revisando... ¿Hay token?:', !!token);

  if (token) {
    return true;
  } else {
    console.warn('🚫 Acceso denegado. Volviendo al Login.');
    router.navigate(['/login']);
    return false;
  }
};
