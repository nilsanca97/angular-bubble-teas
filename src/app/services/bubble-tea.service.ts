import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BubbleTea } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BubbleTeaService {

  // URL base de nuestro backend (FastAPI) para los bubble teas
  private apiUrl = 'http://localhost:8000/bubble-teas';

  // Angular nos "inyecta" HttpClient: la herramienta para hacer peticiones HTTP
  constructor(private http: HttpClient) {}

  // GET /bubble-teas/  ->  devuelve la lista de bubble teas
  getAll(): Observable<BubbleTea[]> {
    return this.http.get<BubbleTea[]>(`${this.apiUrl}/`);
  }
}
