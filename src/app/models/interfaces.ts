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

export interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    birth_date: string | null; // fecha ISO 'YYYY-MM-DD'; null si el usuario no la tiene (DATE NULL en BD)
    active: boolean;
    notifications: boolean;
}

// Credenciales de autenticación (las gestiona Firebase): email + password.
// Es un dominio DISTINTO de la entidad de negocio User -> por eso es una interface
// independiente (no usa User['email']). La page login y register tipan sus
// FormControl de email/password desde aquí.
export interface Credentials {
    email: string;
    password: string;
}