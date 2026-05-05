import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private http = inject(HttpClient);

  // Mantenemos el usuario en memoria
  currentUser = signal<AuthResponse | null>(null);

  constructor() {
    // 🔑 SOLUCIÓN AL REDIRECT: Al iniciar, recuperamos la sesión del navegador
    const token = localStorage.getItem('sge_token');
    const email = localStorage.getItem('sge_email');
    const rol = localStorage.getItem('sge_rol');

    if (token && email && rol) {
      this.currentUser.set({ token, email, rol });
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          // Guardamos todo en la "mochila" del navegador
          localStorage.setItem('sge_token', res.token);
          localStorage.setItem('sge_email', res.email);
          localStorage.setItem('sge_rol', res.rol);
          this.currentUser.set(res);
        })
      );
  }

  logout() {
    localStorage.clear();
    this.currentUser.set(null);
  }
}
