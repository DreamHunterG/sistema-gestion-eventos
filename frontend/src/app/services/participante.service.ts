import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Participante } from '../models/participante.model';
import { ImportResponse } from '../models/import.model';

@Injectable({ providedIn: 'root' })
export class ParticipanteService {
  private apiUrl = 'http://localhost:8080/api/participantes';
  private publicUrl = 'http://localhost:8080/api/public';
  private http = inject(HttpClient);

  getParticipantes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  registrarAsistencia(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/checkin/${id}`, {});
  }

  // 🔑 NUEVO: Método para el CRUD Manual (HU-09)
  registrarManual(nombre: string, email: string, eventoId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/manual`, {
      nombreCompleto: nombre,
      email: email,
      eventoId: eventoId
    });
  }

  validarHash(hash: string): Observable<any> {
    return this.http.get(`${this.publicUrl}/validar/${hash}`);
  }

  importarCSV(file: File, eventoId: number): Observable<ImportResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImportResponse>(`${this.apiUrl}/importar/${eventoId}`, formData);
  }

  // 🔑 CORREGIDO: Recibe el nombre para nombrar el archivo descargado
  descargarCertificado(id: number, nombre: string) {
    const token = localStorage.getItem('sge_token');
    this.http.get(`${this.apiUrl}/download/${id}`, {
      responseType: 'blob',
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Certificado_${nombre.replace(/\s+/g, '_')}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }
}
