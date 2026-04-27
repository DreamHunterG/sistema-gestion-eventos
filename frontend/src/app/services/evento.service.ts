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

  // HU-08: Traer activos
  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }

  // HU-07: Traer archivados
  getInactivos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/inactivos`);
  }

  // NUEVO: Traer todo para las métricas de KPI del Dashboard
  getAll(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/all`);
  }

  guardar(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, evento);
  }

  // HU-07: Cambiar estado (Archivar/Restaurar)
  archivarEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
