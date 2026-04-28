import { Component, inject, signal } from '@angular/core'; // 🔑 CORREGIDO: Viene de @angular/core
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipanteService } from '../../services/participante.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-verificacion',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './verificacion.component.html',
  styleUrl: './verificacion.component.scss'
})
export class VerificacionComponent {
  private participanteService = inject(ParticipanteService);

  hashInput = '';
  resultado = signal<any>(null);

  validar() {
    if (!this.hashInput) return;
    this.participanteService.validarHash(this.hashInput).subscribe({
      next: (res: any) => this.resultado.set(res), // 🔑 CORREGIDO: Tipo explícito 'any'
      error: () => this.resultado.set({ valido: false })
    });
  }
}
