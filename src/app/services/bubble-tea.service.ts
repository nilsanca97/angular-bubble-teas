import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BubbleTea, BubbleTeaPayload } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BubbleTeaService {

  // URL base de nuestro backend (FastAPI) para los bubble teas
  private apiUrl = 'http://localhost:8000/bubble-teas';

  // inject() -> forma moderna de inyección de dependencias en Angular.
  // Angular nos da una instancia lista de HttpClient (la herramienta para
  // hacer peticiones HTTP) sin necesidad de declararla en el constructor.
  private http = inject(HttpClient);

  // GET /bubble-teas/  ->  devuelve la lista de bubble teas (PÚBLICO)
  getAll(): Observable<BubbleTea[]> {
    return this.http.get<BubbleTea[]>(`${this.apiUrl}/`);
  }

  // GET /bubble-teas/{id}  ->  devuelve UN bubble tea (PÚBLICO).
  // Lo usaremos para precargar el formulario en la página de Editar.
  getById(id: number): Observable<BubbleTea> {
    return this.http.get<BubbleTea>(`${this.apiUrl}/${id}`);
  }

  // POST /bubble-teas/  ->  CREA un bubble tea (PROTEGIDO en el backend).
  // Enviamos el payload SIN id; el backend nos devuelve el objeto creado (con id).
  // NOTA: aún no añadimos el token -> de momento responderá 401 (esperado).
  create(payload: BubbleTeaPayload): Observable<BubbleTea> {
    return this.http.post<BubbleTea>(`${this.apiUrl}/`, payload);
  }

  // PUT /bubble-teas/{id}  ->  EDITA un bubble tea existente (PROTEGIDO).
  // Reemplaza todos los campos con el payload (el id va en la URL, no en el body).
  update(id: number, payload: BubbleTeaPayload): Observable<BubbleTea> {
    return this.http.put<BubbleTea>(`${this.apiUrl}/${id}`, payload);
  }

  // DELETE /bubble-teas/{id}  ->  BORRA un bubble tea (PROTEGIDO).
  // El backend responde { message: "Bubble Tea deleted" }.
  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
