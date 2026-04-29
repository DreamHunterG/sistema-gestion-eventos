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

  // HU-12: Listar todos
  getParticipantes(): Observable<Participante[]> {
    return this.http.get<Participante[]>(this.apiUrl);
  }

  // HU-13/14: Check-in (QR o Manual)
  registrarAsistencia(id: number): Observable<Participante> {
    return this.http.put<Participante>(`${this.apiUrl}/checkin/${id}`, {});
  }

  // HU-19: Validación Pública (Sin Token)
  validarHash(hash: string): Observable<any> {
    return this.http.get(`${this.publicUrl}/validar/${hash}`);
  }

  // HU-10: Carga Masiva
  importarCSV(file: File, eventoId: number): Observable<ImportResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ImportResponse>(`${this.apiUrl}/importar/${eventoId}`, formData);
  }

  // HU-18: Descarga PDF
  descargarCertificado(id: number, nombreParticipante: string) {
    const token = localStorage.getItem('sge_token');

    // Llamamos al endpoint del backend
    this.http.get(`http://localhost:8080/api/participantes/download/${id}`, {
      responseType: 'blob', // 🔑 CRÍTICO: Le decimos a Angular que viene un archivo, no un texto
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (blob) => {
        // Creamos un link invisible para descargar el archivo
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
