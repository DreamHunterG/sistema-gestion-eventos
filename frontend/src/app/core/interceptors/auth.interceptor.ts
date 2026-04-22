import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Buscamos el Token en el "bolsillo" del navegador
  const token = localStorage.getItem('sge_token');

  // 2. Si el token existe, se lo pegamos a la petición antes de enviarla a Java
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
