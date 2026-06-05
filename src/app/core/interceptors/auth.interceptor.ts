import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { API_URL } from '../api.config';

// Interceptor FUNCIONAL (estilo moderno con inject()): añade automáticamente
// el header "Authorization: Bearer <idToken>" a las peticiones que van a NUESTRO
// backend, para que POST/PUT/DELETE dejen de devolver 401.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // inject() dentro del interceptor funcional: pedimos el AuthService (que encapsula
  // Firebase) sin tocar el SDK directamente -> separación de responsabilidades.
  const authService = inject(AuthService);

  // 1) ¿Esta petición va a nuestro backend? Filtramos por la URL base compartida.
  //    Las peticiones a otros dominios (p. ej. Firebase) NO se tocan.
  const isApiRequest = req.url.startsWith(API_URL);
  if (!isApiRequest) {
    return next(req);
  }

  // 2) getToken() devuelve una Promesa -> la convertimos al mundo Observable con from().
  return from(authService.getToken()).pipe(
    // switchMap: espera a que llegue el token y, según el resultado, deja salir la petición.
    switchMap((token) => {
      // Si NO hay token (usuario no logueado), dejamos pasar la petición SIN header.
      // Los GET públicos seguirán funcionando; los protegidos darán 401 (esperado).
      if (!token) {
        return next(req);
      }

      // Programación defensiva: si la petición YA trae un Authorization propio,
      // no lo sobrescribimos (respetamos quien lo haya puesto a propósito).
      if (req.headers.has('Authorization')) {
        return next(req);
      }

      // HttpRequest es INMUTABLE: clonamos la petición añadiéndole el header.
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(authReq);
    }),

    // 3) Si getToken() FALLA (la Promesa rechaza), no rompemos la petición:
    //    la dejamos pasar sin header (mismo criterio que "sin usuario").
    catchError(() => next(req))
  );
};