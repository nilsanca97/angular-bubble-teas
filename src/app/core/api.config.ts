import { environment } from '../../environments/environment';

// URL base de nuestro backend (FastAPI).
// La URL real ahora vive en los Angular environments (environment.ts = dev,
// environment.prod.ts = prod). Este archivo actúa como ADAPTADOR fino: solo
// re-exporta environment.apiUrl bajo el nombre API_URL, para que el BubbleTeaService
// y el interceptor sigan importando API_URL sin enterarse de DÓNDE sale la URL.
// Sigue siendo la única fuente de verdad para los consumidores (si cambia el origen,
// se toca SOLO aquí).
export const API_URL = environment.apiUrl;