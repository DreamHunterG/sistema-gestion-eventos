import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Buscamos el token en la mochila del navegador
  const token = localStorage.getItem('sge_token');

  // 2. Si hay token, se lo pegamos a la petición antes de que salga
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // 3. Si no hay token, la petición sigue su curso normal
  return next(req);
};
