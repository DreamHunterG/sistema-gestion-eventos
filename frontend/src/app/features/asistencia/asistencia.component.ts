import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipanteService } from '../../services/participante.service';
import { EventoService } from '../../services/evento.service';
import { Participante } from '../../models/participante.model';
import { Evento } from '../../models/evento.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTableModule, MatButtonModule, MatSnackBarModule, MatSelectModule],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.scss'
})
export class AsistenciaComponent implements OnInit {
  private participanteService = inject(ParticipanteService);
  private eventoService = inject(EventoService);
  private snackBar = inject(MatSnackBar);

  eventos = signal<Evento[]>([]);
  eventoSeleccionado = signal<number | null>(null);
  participantes = signal<Participante[]>([]);
  searchTerm = signal('');
  showFilters = signal(false); // 🔑 Ahora sí la usamos
  currentPage = signal(1);
  displayedColumns: string[] = ['nombre', 'email', 'estado', 'acciones'];

  asistentesCount = computed(() => this.participantes().filter(p => p.asistio).length);

  calculatePercent() {
    if (this.participantes().length === 0) return 0;
    return Math.round((this.asistentesCount() / this.participantes().length) * 100);
  }

  filteredParticipantes = computed(() => {
    return this.participantes().filter(p =>
      p.persona?.nombreCompleto.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
  });

  ngOnInit() { this.eventoService.getEventos().subscribe((data: Evento[]) => this.eventos.set(data)); }

  onEventoChange(id: number) {
    this.eventoSeleccionado.set(id);
    this.participanteService.getParticipantes().subscribe((data: Participante[]) => {
      this.participantes.set(data.filter(p => p.evento?.id === id));
    });
  }

  checkin(id: number) {
    this.participanteService.registrarAsistencia(id).subscribe(() => {
      this.snackBar.open('¡Ingreso Validado!', 'Cerrar', { duration: 2000 });
      this.onEventoChange(this.eventoSeleccionado()!);
    });
  }

  descargar(id: number, nombre: string) {
    this.participanteService.descargarCertificado(id, nombre);
  }
}
