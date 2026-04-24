import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImportResponse } from '../models/import.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteService {
  private apiUrl = 'http://localhost:8080/api/participantes';
  private http = inject(HttpClient);

  // 📥 HU-10: Carga Masiva CSV
  importarCSV(file: File, eventoId: number): Observable<ImportResponse> {
    const formData = new FormData();
    formData.append('file', file); // 'file' debe coincidir con el @RequestParam de Java
    return this.http.post<ImportResponse>(`${this.apiUrl}/importar/${eventoId}`, formData);
  }
}
