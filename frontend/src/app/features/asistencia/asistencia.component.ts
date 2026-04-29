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
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.scss'
})
export class AsistenciaComponent implements OnInit {
  private participanteService = inject(ParticipanteService);
  private eventoService = inject(EventoService);
  private snackBar = inject(MatSnackBar);

  // --- 📊 ESTADOS DE DATOS ---
  eventos = signal<Evento[]>([]);
  eventoSeleccionado = signal<number | null>(null);
  participantes = signal<Participante[]>([]);

  // --- ⚙️ ESTADOS DE INTERFAZ (🔑 AQUÍ SE CORRIGE EL ERROR) ---
  showFilters = signal(false);
  searchTerm = signal('');
  currentPage = signal(1);
  displayedColumns: string[] = ['nombre', 'email', 'estado', 'acciones'];

  // --- 🧠 MOTOR DE CÁLCULO DINÁMICO ---

  // Cuenta cuántos han asistido en el evento actual
  asistentesCount = computed(() =>
    this.participantes().filter(p => p.asistio).length
  );

  // Calcula el porcentaje para el círculo visual del Figma
  calculatePercent() {
    if (this.participantes().length === 0) return 0;
    return Math.round((this.asistentesCount() / this.participantes().length) * 100);
  }

  // Filtra la tabla según el nombre o email escrito
  filteredParticipantes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.participantes().filter(p =>
      p.nombreCompleto.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term)
    );
  });

  // --- 🚀 ACCIONES ---

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.eventoService.getEventos().subscribe({
      next: (data) => this.eventos.set(data),
      error: () => this.notificar('Falla al conectar con el servidor', 'error')
    });
  }

  onEventoChange(id: number) {
    this.eventoSeleccionado.set(id);
    this.cargarLista();
  }

  cargarLista() {
    this.participanteService.getParticipantes().subscribe({
      next: (data: Participante[]) => {
        // Vinculamos participantes solo al evento elegido
        const filtrados = data.filter(p => p.evento?.id === this.eventoSeleccionado());
        this.participantes.set(filtrados);
      },
      error: () => this.notificar('Error al cargar asistentes', 'error')
    });
  }

  checkin(id: number) {
    this.participanteService.registrarAsistencia(id).subscribe({
      next: () => {
        this.notificar('¡Ingreso Validado! Registro exitoso.', 'success');
        this.cargarLista(); // Refresca para actualizar el Hash y el círculo
      },
      error: () => this.notificar('No se pudo procesar el ingreso', 'error')
    });
  }

  // Acción para descargar el certificado, ahora con el nombre incluido
  descargar(id: number) {
    // Buscamos al participante en la lista local para obtener su nombre
    const p = this.participantes().find(part => part.id === id);
    if (p) {
      // Ahora enviamos los 2 datos que el servicio pide: ID y Nombre
      this.participanteService.descargarCertificado(p.id, p.nombreCompleto);
      this.notificar('Generando diploma oficial...', 'success');
    }
  }

  private notificar(msg: string, tipo: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? ['bg-green-600'] : ['bg-red-600']
    });
  }
}
