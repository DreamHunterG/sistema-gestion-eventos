import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private apiUrl = 'http://localhost:8080/api/eventos';
  private http = inject(HttpClient);

  // HU-08: Traer eventos activos
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }

  // HU-07: NUEVO - Traer eventos archivados
  getInactivos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/inactivos`);
  }

  // HU-05 y HU-06: Crear o Actualizar
  guardar(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento);
  }

  // HU-07: Archivado lógico
  archivarEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
