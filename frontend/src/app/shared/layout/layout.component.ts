import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RecompensaComponent } from '../recompensa/recompensa.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatDialogModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  protected authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  solicitarRecompensa() {
    this.dialog.open(RecompensaComponent, {
      width: '500px',
      maxWidth: '95vw',
      // Esta clase es la que usaremos en el CSS global para quitar el fondo blanco
      panelClass: 'recompensa-modal-container'
    });
  }
}
