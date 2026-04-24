import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento.model';

// Material Imports
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private eventoService = inject(EventoService);
  private snackBar = inject(MatSnackBar);

  // --- ESTADOS DE DATOS ---
  eventos = signal<Evento[]>([]);
  showFilters = signal(false);
  isFormVisible = signal(false);
  isEditing = signal(false);
  isUploading = signal(false);
  currentPage = signal(1);

  // --- 🔑 FILTROS AVANZADOS (Sincronizados con los Labels del HTML) ---
  searchName = signal('');
  searchAforo = signal<number | null>(null);
  filterTipo = signal('');
  filterModalidad = signal('');
  dateStart = signal('');
  dateEnd = signal('');

  // --- OBJETO PARA CRUD ---
  currentEvento: Evento = this.initEvento();

  // --- MOTOR DE FILTRADO DINÁMICO ---
  filteredEventos = computed(() => {
    return this.eventos().filter(e => {
      const matchName = e.nombre.toLowerCase().includes(this.searchName().toLowerCase());
      const matchAforo = this.searchAforo() !== null ? e.aforoMaximo >= this.searchAforo()! : true;
      const matchTipo = this.filterTipo() ? e.tipoEvento === this.filterTipo() : true;
      const matchMod = this.filterModalidad() ? e.modalidad === this.filterModalidad() : true;

      let matchDate = true;
      if (this.dateStart() && this.dateEnd()) {
        const start = new Date(this.dateStart()).getTime();
        const end = new Date(this.dateEnd()).getTime();
        const eventDate = new Date(e.fechaEvento).getTime();
        matchDate = eventDate >= start && eventDate <= end;
      }
      return matchName && matchAforo && matchTipo && matchMod && matchDate;
    });
  });

  displayedColumns: string[] = ['nombre', 'modalidad', 'fecha', 'aforo', 'estado', 'acciones'];

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.eventoService.getEventos().subscribe({
      next: (data) => this.eventos.set(data),
      error: () => this.notificar('Falla de conexión al servidor', 'error')
    });
  }

  onSave() {
    this.isUploading.set(true);
    this.eventoService.guardar(this.currentEvento).subscribe({
      next: () => {
        this.notificar('Logro guardado con éxito', 'success');
        this.cargarEventos();
        this.toggleForm();
        this.isUploading.set(false);
      },
      error: () => {
        this.notificar('Error al procesar la solicitud', 'error');
        this.isUploading.set(false);
      }
    });
  }

  onEdit(evento: Evento) {
    this.isEditing.set(true);
    this.currentEvento = { ...evento };
    this.isFormVisible.set(true);
    // Scroll automático para ver el formulario
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  onArchivar(id: number | undefined) {
    if (!id || !confirm('¿Desea cambiar el estado de disponibilidad?')) return;
    this.eventoService.archivarEvento(id).subscribe(() => {
      this.notificar('Estado actualizado', 'success');
      this.cargarEventos();
    });
  }

  toggleForm() {
    this.isFormVisible.update(v => !v);
    if (!this.isFormVisible()) {
      this.isEditing.set(false);
      this.currentEvento = this.initEvento();
    }
  }

  getIcon(tipo: string): string {
    return tipo === 'TORNEO' ? 'emoji_events' : (tipo === 'TALLER' ? 'engineering' : 'school');
  }

  private initEvento(): Evento {
    return {
      nombre: '',
      fechaEvento: '',
      aforoMaximo: 0,
      tipoEvento: 'CAPACITACION',
      modalidad: 'PRESENCIAL',
      estado: 'ACTIVO'
    };
  }

  private notificar(msg: string, tipo: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? ['bg-green-600'] : ['bg-red-600']
    });
  }
}
