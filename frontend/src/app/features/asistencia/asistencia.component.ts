import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipanteService } from '../../services/participante.service';
import { EventoService } from '../../services/evento.service';
import { Participante } from '../../models/participante.model';
import { Evento } from '../../models/evento.model';

// Material Imports (🔑 Imprescindibles para que el HTML funcione)
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatTableModule,
    MatButtonModule, MatSelectModule, MatFormFieldModule, MatSnackBarModule
  ],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.scss'
})
export class AsistenciaComponent implements OnInit {
  private participanteService = inject(ParticipanteService);
  private eventoService = inject(EventoService);
  private snackBar = inject(MatSnackBar);

  // --- 📊 SIGNALS (Lo que el HTML pide) ---
  eventos = signal<Evento[]>([]);
  eventoSeleccionado = signal<number | null>(null);
  participantes = signal<Participante[]>([]);
  searchTerm = signal('');
  searchAforo = signal<number | null>(null);
  filterTipo = signal('');
  filterModalidad = signal('');
  dateStart = signal('');
  dateEnd = signal('');
  showFilters = signal(false);
  currentPage = signal(1); // 🔑 Corregido: Ya existe para la paginación

  // --- 🧠 CÁLCULOS ---
  asistentesCount = computed(() => this.participantes().filter(p => p.asistio).length);

  calculatePercent() {
    if (this.participantes().length === 0) return 0;
    return Math.round((this.asistentesCount() / this.participantes().length) * 100);
  }

  filteredParticipantes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.participantes().filter(p =>
      p.persona.nombreCompleto.toLowerCase().includes(term) ||
      p.persona.email.toLowerCase().includes(term)
    );
  });

  displayedColumns: string[] = ['nombre', 'email', 'estado', 'acciones'];

  ngOnInit() { this.cargarEventos(); }

  cargarEventos() {
    this.eventoService.getEventos().subscribe(data => this.eventos.set(data));
  }

  // --- 🚀 FUNCIONES DE ACCIÓN (Placeholders funcionales) ---
  onEventoChange(id: number) {
    this.eventoSeleccionado.set(id);
    this.cargarLista();
  }

  cargarLista() {
    this.participanteService.getParticipantes().subscribe({
      next: (data) => {
        const filtrados = data.filter(p => p.evento.id === this.eventoSeleccionado());
        this.participantes.set(filtrados);
      }
    });
  }

  checkin(id: number) {
    this.participanteService.registrarAsistencia(id).subscribe(() => {
      this.notificar('¡Ingreso Validado!', 'success');
      this.cargarLista();
    });
  }

  descargar(id: number) {
    const p = this.participantes().find(part => part.id === id);
    if (p) this.participanteService.descargarCertificado(p.id, p.persona.nombreCompleto);
  }

  verHistorial(email: string) {
    alert('Consultando historial para: ' + email);
  }

  private notificar(msg: string, tipo: string) {
    this.snackBar.open(msg, 'OK', { duration: 3000, panelClass: tipo === 'success' ? ['bg-green-600'] : ['bg-red-600'] });
  }

  getIcon(tipo: string) {
    return tipo === 'TORNEO' ? 'emoji_events' : 'school';
  }
}
