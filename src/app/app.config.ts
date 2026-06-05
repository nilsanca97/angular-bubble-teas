import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding() -> permite recibir los parámetros de ruta
    // (p. ej. el :id de /edit/:id) directamente como inputs del componente.
    provideRouter(routes, withComponentInputBinding()),
    // habilita HttpClient y registra el authInterceptor, que añade el token
    // "Authorization: Bearer <idToken>" a las peticiones a nuestro backend.
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNoopAnimations() // para evitar errores de animaciones en Angular Material
    //provideAnimations()  // para habilitar las animaciones de material

  ]
};
