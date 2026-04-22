import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento.model';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTableModule, MatButtonModule, MatChipsModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private eventoService = inject(EventoService);

  // Signal: Lista de eventos que reacciona a los cambios del Backend
  eventos = signal<Evento[]>([]);

  // Columnas exactas de tu diseño de Figma
  displayedColumns: string[] = ['nombre', 'fecha', 'aforo', 'estado', 'acciones'];

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos() {
    // 🚀 Ahora .getEventos() ya existe en el servicio y no dará error
    this.eventoService.getEventos().subscribe({
      next: (data: Evento[]) => {
        this.eventos.set(data);
      },
      error: (err: any) => {
        console.error('Error cargando eventos desde el servidor:', err);
      }
    });
  }
}
