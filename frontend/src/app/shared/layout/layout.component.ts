import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Material UI
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Componentes adicionales
import { RecompensaComponent } from '../recompensa/recompensa.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  // Inyecciones de dependencia (Servicios)
  protected authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // 🔑 Lógica de Seguridad: Verificamos si es Administrador para mostrar opciones sensibles
  esAdmin = computed(() => this.authService.currentUser()?.rol === 'ADMIN');

  // 🎁 CUMPLIMIENTO REQUERIMIENTO: Recompensa con mensaje JSON
  solicitarRecompensa() {
    const dataRecompensa = {
      id_insignia: "SGE-PRESTIGIO-001",
      mensaje: "¡Felicidades! Has validado la integridad del sistema.",
      timestamp: new Date().toISOString(),
      valor_producto: "Seniority Validated"
    };

    // Mostramos el JSON en consola como pide el requerimiento técnico
    console.log("RECOMPENSA GENERADA:", JSON.stringify(dataRecompensa, null, 2));

    // Abrimos el modal visual para el usuario
    this.dialog.open(RecompensaComponent, {
      width: '450px',
      panelClass: 'custom-modal-recompensa'
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.snackBar.open('Sesión cerrada con éxito', 'OK', { duration: 2000 });
  }
}
