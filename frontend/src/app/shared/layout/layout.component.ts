import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // 🔑 Importado correctamente
import { RecompensaComponent } from '../recompensa/recompensa.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  // 🔑 Añadimos MatDialogModule a los imports
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatDialogModule],
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

  // CUMPLIMIENTO RECOMPENSA: Lógica de apertura corregida
  // 🎁 AHORA SÍ: Esta función abre tu componente de recompensa
  solicitarRecompensa() {
    this.dialog.open(RecompensaComponent, {
      width: '500px',
      panelClass: 'recompensa-modal'
    });
  }
}
