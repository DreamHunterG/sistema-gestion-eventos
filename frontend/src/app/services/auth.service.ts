import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  // Signal con estado inicial desde el LocalStorage
  currentUser = signal<AuthResponse | null>(null);

  constructor(private http: HttpClient) {
    // 🔑 PERSISTENCIA: Al arrancar, buscamos si ya había un usuario guardado
    const savedUser = localStorage.getItem('sge_user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          localStorage.setItem('sge_token', res.token);
          // 🔑 Guardamos el objeto completo (incluyendo el ROL)
          localStorage.setItem('sge_user', JSON.stringify(res));
          this.currentUser.set(res);
        })
      );
  }

  logout() {
    localStorage.removeItem('sge_token');
    localStorage.removeItem('sge_user');
    this.currentUser.set(null);
  }
}
