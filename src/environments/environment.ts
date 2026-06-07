// Entorno BASE = DESARROLLO (development).
// Este es el archivo que el código importa SIEMPRE (la "base"). Por defecto, con
// `ng serve` (configuración development) se usan estos valores de desarrollo.
// En el build de PRODUCCIÓN, Angular lo sustituye por environment.prod.ts
// gracias al fileReplacements configurado en angular.json.
export const environment = {
  // URL base de nuestro backend FastAPI en local.
  apiUrl: 'http://localhost:8000',
};
