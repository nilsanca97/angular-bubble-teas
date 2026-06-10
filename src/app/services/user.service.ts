import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserPayload } from '../models/interfaces';
import { API_URL } from '../core/api.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Endpoint de usuarios, construido a partir de la URL base compartida (API_URL).
  // Así la URL del backend vive en un único sitio (core/api.config.ts).
  private apiUrl = `${API_URL}/users`;

  // inject() -> forma moderna de inyección de dependencias en Angular.
  private http = inject(HttpClient);

  // GET /users/  ->  devuelve la lista de usuarios (PROTEGIDO: requiere token).
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/`);
  }

  // GET /users/{id}  ->  devuelve UN usuario (PROTEGIDO).
  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // GET /users/me  ->  devuelve el PERFIL PROPIO según el token (PROTEGIDO).
  // El backend hace get-or-create: una fila recién auto-provisionada nace con
  // name/surname = null (por eso User los admite como null).
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  // POST /users/  ->  CREA un usuario (PROTEGIDO).
  // Enviamos el payload SIN id; el backend nos devuelve el objeto creado (con id).
  create(payload: UserPayload): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/`, payload);
  }

  // PUT /users/{id}  ->  EDITA un usuario existente (PROTEGIDO).
  // Reemplaza todos los campos con el payload (el id va en la URL, no en el body).
  update(id: number, payload: UserPayload): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, payload);
  }

  // DELETE /users/{id}  ->  BORRA un usuario (PROTEGIDO).
  // El backend responde { message: "User deleted" }.
  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
