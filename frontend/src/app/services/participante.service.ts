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

  getParticipantes(): Observable<Participante[]> {
    return this.http.get<Participante[]>(this.apiUrl);
  }

  registrarAsistencia(id: number): Observable<Participante> {
    return this.http.put<Participante>(`${this.apiUrl}/checkin/${id}`, {});
  }

  // 🔑 MÉTODO FALTANTE: Historial por Persona (HU-25)
  getHistorial(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historial/${email}`);
  }

  validarHash(hash: string): Observable<any> {
    return this.http.get(`${this.publicUrl}/validar/${hash}`);
  }

  importarCSV(file: File, eventoId: number): Observable<ImportResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImportResponse>(`${this.apiUrl}/importar/${eventoId}`, formData);
  }

  descargarCertificado(id: number, nombreParticipante: string) {
    const token = localStorage.getItem('sge_token');
    this.http.get(`${this.apiUrl}/download/${id}`, {
      responseType: 'blob',
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Certificado_${nombreParticipante.replace(/\s+/g, '_')}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error al descargar el PDF', err)
    });
  }
}
