import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, UsuarioRequest } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private http = inject(HttpClient);

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearUsuario(u: UsuarioRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registro`, u);
  }

  actualizarUsuario(id: number, u: UsuarioRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, u);
  }

  // 🔑 Este método llama al @DeleteMapping de Java que hace el archivado lógico
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
