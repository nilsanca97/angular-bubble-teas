import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding() -> permite recibir los parámetros de ruta
    // (p. ej. el :id de /edit/:id) directamente como inputs del componente.
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(), // habilita HttpClient para hacer peticiones HTTP al backend
    provideNoopAnimations() // para evitar errores de animaciones en Angular Material
    //provideAnimations()  // para habilitar las animaciones de material

  ]
};
