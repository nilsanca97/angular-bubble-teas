// Entorno de PRODUCCIÓN.
// Sustituye a environment.ts durante el build de producción (fileReplacements en
// angular.json, configuración "production").
// Todavía no hay backend desplegado, así que usamos un placeholder evidente.
export const environment = {
  // Placeholder a propósito: NO es una URL válida, para que un build de producción
  // falle de forma evidente en lugar de apuntar a localhost por accidente.
  // TODO: cambiar esta URL por la del backend real cuando despleguemos en producción.
  apiUrl: 'https://TODO-pon-aqui-la-url-de-produccion',
};
