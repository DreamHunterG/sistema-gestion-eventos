import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipanteService } from '../../services/participante.service';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTableModule, MatButtonModule, MatSnackBarModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.scss'
})
export class AsistenciaComponent implements OnInit {
  private participanteService = inject(ParticipanteService);
  private eventoService = inject(EventoService);
  private snackBar = inject(MatSnackBar);

  eventos = signal<Evento[]>([]);
  eventoSeleccionado = signal<number | null>(null);
  participantes = signal<any[]>([]);

  showFilters = signal(false);
  isFormVisible = signal(false);
  isUploading = signal(false);
  searchTerm = signal('');

  nuevoParticipante = { nombreCompleto: '', email: '' };

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

  onEventoChange(id: number) {
    this.eventoSeleccionado.set(id);
    this.cargarLista();
  }

  cargarLista() {
    this.participanteService.getParticipantes().subscribe({
      next: (data: any[]) => {
        // ✅ CORRECCIÓN TS18048: Usamos ?. para evitar el error de undefined
        this.participantes.set(data.filter(p => p.evento?.id === this.eventoSeleccionado()));
      }
    });
  }

  // ✅ CORRECCIÓN TS2554: Ahora pasamos 2 argumentos (ID y EventoID)
  checkin(id: number) {
    const eventoId = this.eventoSeleccionado();
    if (!eventoId) return;

    this.participanteService.registrarAsistencia(id, eventoId).subscribe({
      next: () => {
        this.notificar('¡Ingreso Validado!', 'success');
        this.cargarLista();
      },
      error: () => this.notificar('Error al procesar el check-in', 'error')
    });
  }

  onSaveManual() {
    if (!this.nuevoParticipante.nombreCompleto || !this.nuevoParticipante.email || !this.eventoSeleccionado()) return;
    this.isUploading.set(true);

    this.participanteService.registrarManual(
      this.nuevoParticipante.nombreCompleto,
      this.nuevoParticipante.email,
      this.eventoSeleccionado()!
    ).subscribe({
      next: () => {
        this.notificar('Participante vinculado con éxito', 'success');
        this.cargarLista();
        this.isFormVisible.set(false);
        this.nuevoParticipante = { nombreCompleto: '', email: '' };
        this.isUploading.set(false);
      },
      error: () => {
        this.notificar('Error en el registro', 'error');
        this.isUploading.set(false);
      }
    });
  }

  descargar(id: number, nombre: string) {
    this.participanteService.descargarCertificado(id, nombre);
  }

  toggleForm() { this.isFormVisible.update(v => !v); }

  private notificar(msg: string, tipo: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000, panelClass: tipo === 'success' ? ['bg-green-600'] : ['bg-red-600'] });
  }
}
