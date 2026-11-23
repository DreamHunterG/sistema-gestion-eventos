import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTableModule, MatSnackBarModule],
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.scss'
})
export class AuditoriaComponent implements OnInit {
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);

  logs = signal<any[]>([]);
  searchTerm = signal('');

  // 🔑 Columnas finales: Fecha, Usuario, Acción, Entidad, Detalle (SIN IP)
  displayedColumns: string[] = ['fecha', 'usuario', 'accion', 'entidad', 'detalle'];

  filteredLogs = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.logs().filter((l: any) =>
      l.usuarioEmail?.toLowerCase().includes(term) ||
      l.accion?.toLowerCase().includes(term) ||
      l.detalle?.toLowerCase().includes(term)
    );
  });

  ngOnInit() { this.cargarLogs(); }

  cargarLogs() {
    this.http.get<any[]>('http://localhost:8080/api/auditoria').subscribe({
      next: (data) => this.logs.set(data),
      error: () => this.snackBar.open('Error al cargar logs de ROOM_911', 'Cerrar', { duration: 3000 })
    });
  }
}
