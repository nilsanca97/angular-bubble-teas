import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

// Interceptor FUNCIONAL (estilo moderno con inject()) de ERRORES HTTP.
// Responsabilidad ÚNICA: reaccionar a las RESPUESTAS de error del backend.
// Hoy solo gestiona el 401 (sesión inválida/caducada): cierra sesión y manda
// al usuario a /login. Queda separado del authInterceptor (que decora la
// petición SALIENTE con el token) para no mezclar responsabilidades y poder
// añadir aquí 403/500/snackbar en el futuro sin tocar el de token.
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // inject() dentro del interceptor funcional: AuthService (encapsula Firebase,
  // nos da logout()) y Router (para redirigir). No tocamos el SDK directamente.
  const authService = inject(AuthService);
  const router = inject(Router);

  // Dejamos salir la petición y nos enganchamos a su RESPUESTA con catchError.
  return next(req).pipe(
    catchError((error: unknown) => {
      // Solo nos interesa el 401 ("no autorizado": token ausente, inválido o caducado).
      // Comprobamos que sea un error HTTP antes de mirar su status.
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // EFECTO SECUNDARIO: cerramos la sesión de Firebase y, SOLO cuando ha
        // terminado (orden predecible), redirigimos a /login. El .catch evita
        // dejar la promesa "flotante" si logout() llegara a rechazar.
        authService.logout()
          .then(() => router.navigate(['/login']))
          .catch(() => router.navigate(['/login']));
      }

      // Re-lanzamos SIEMPRE el error (patrón idiomático): gestionar el 401 es un
      // efecto secundario, pero quien hizo la petición también debe enterarse del
      // fallo (hoy nada; mañana un snackbar). NO silenciamos el error.
      return throwError(() => error);
    })
  );
};
