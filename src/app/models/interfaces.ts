export interface BubbleTea {
  id: number;
  name: string;
  temperature: number;
  precio: number;
  active: boolean;
}

// Payload para CREAR/EDITAR: es un BubbleTea SIN el "id".
// El backend genera el id solo; en POST/PUT solo enviamos estos 4 campos
// (coincide con BubbleTeaCreate de FastAPI: name, temperature, precio, active).
// Usamos Omit<> para no repetir los campos: si mañana cambia BubbleTea,
// este tipo se actualiza solo.
export type BubbleTeaPayload = Omit<BubbleTea, 'id'>;

// Campos COMUNES a lectura y escritura (misma forma y estrictez en ambas).
// Espeja UserBase del backend. name/surname NO van aquí porque difieren entre leer y escribir.
interface UserBase {
    email: string;
    birth_date: string | null; // fecha ISO 'YYYY-MM-DD'; null si el usuario no la tiene (DATE NULL en BD)
    active: boolean;
    notifications: boolean;
}

// Modelo de LECTURA: lo que DEVUELVE la API (espeja UserResponse del backend).
// name/surname pueden ser null: una fila auto-provisionada por GET /users/me nace sin
// nombre (solo se conoce el email del token).
export interface User extends UserBase {
    id: number;
    name: string | null;
    surname: string | null;
}

// Payload de ESCRITURA para CREAR/EDITAR (espeja UserCreate del backend).
// Aquí name/surname son OBLIGATORIOS: el alta explícita (registro) debe aportarlos;
// el null solo aparece al LEER (perfil auto-provisionado), nunca al escribir.
export interface UserPayload extends UserBase {
    name: string;
    surname: string;
}

// Credenciales de autenticación (las gestiona Firebase): email + password.
// Es un dominio DISTINTO de la entidad de negocio User -> por eso es una interface
// independiente (no usa User['email']). La page login y register tipan sus
// FormControl de email/password desde aquí.
export interface Credentials {
    email: string;
    password: string;
}