import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // Dirección de la ventanilla de usuarios en Java
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private http = inject(HttpClient);

  // HU-02: Traer todo el equipo (Vigentes e Inactivos)
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // HU-02: Crear integrante (Ruta /registro definida en Java)
  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/registro`, usuario);
  }

  // HU-02: Actualizar perfil (Usa PUT)
  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  // HU-02: Cambiar estado (Toggle de archivado)
  // Usamos DELETE porque en el controlador de Java lo mapeamos así
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
