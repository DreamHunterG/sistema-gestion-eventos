import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../models/auth.model';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  // Inyecta el servicio para que el error desaparezca:
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email!, password!).subscribe({
        next: (res: AuthResponse) => { // Tipar la respuesta
          this.snackBar.open('¡Acceso concedido! Bienvenido al SGE.', 'Cerrar', { duration: 3000 });
          localStorage.setItem('sge_user_role', res.rol);
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => { //  Tiparel error
          this.snackBar.open('Error: Usuario o contraseña incorrectos.', 'Cerrar', { duration: 5000 });
        }
      });
    }
  }
}
