// URL base de nuestro backend (FastAPI).
// Única fuente de verdad: la usan tanto el BubbleTeaService como el interceptor,
// para no duplicar la URL en varios sitios (si cambia, se toca SOLO aquí).
// NOTA: en una futura sesión esto migrará a Angular environments (dev/prod).
export const API_URL = 'http://localhost:8000';