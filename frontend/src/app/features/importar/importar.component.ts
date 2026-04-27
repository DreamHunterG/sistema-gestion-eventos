import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipanteService } from '../../services/participante.service';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento.model';
import { ImportResponse } from '../../models/import.model';

// Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [
    CommonModule, MatIconModule, MatButtonModule, FormsModule,
    MatProgressBarModule, MatSnackBarModule, MatSelectModule, MatFormFieldModule
  ],
  templateUrl: './importar.component.html',
  styleUrl: './importar.component.scss'
})
export class ImportarComponent implements OnInit {
  private participanteService = inject(ParticipanteService);
  private eventoService = inject(EventoService);
  private snackBar = inject(MatSnackBar);

  eventos = signal<Evento[]>([]);
  eventoSeleccionado = signal<number | null>(null);
  selectedFile = signal<File | null>(null);
  isUploading = signal<boolean>(false);
  uploadProgress = signal<number>(0);
  importResult = signal<ImportResponse | null>(null);

  // 🟢 NUEVO: Estado para el efecto visual de arrastre
  isDragging = signal(false);

  ngOnInit() {
    this.eventoService.getEventos().subscribe({
      next: (data) => this.eventos.set(data),
      error: () => this.notificar('No se pudieron cargar los eventos', 'error')
    });
  }

  // Lógica común para validar el archivo
  private validarYAsignarArchivo(file: File) {
    if (file && file.name.toLowerCase().endsWith('.csv')) {
      this.selectedFile.set(file);
      this.importResult.set(null);
      this.uploadProgress.set(0);
    } else {
      this.notificar('Por favor, selecciona un archivo .CSV válido', 'error');
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.validarYAsignarArchivo(file);
  }

  // 🟢 NUEVOS: Métodos para Drag and Drop
  onDragOver(event: DragEvent) {
    event.preventDefault(); // Evita que el navegador abra el archivo
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.validarYAsignarArchivo(file);
    }
  }

  procesarArchivo() {
    if (!this.selectedFile() || !this.eventoSeleccionado()) {
      this.notificar('Faltan datos: Selecciona evento y archivo', 'error');
      return;
    }

    this.isUploading.set(true);
    this.simularProgreso();

    this.participanteService.importarCSV(this.selectedFile()!, this.eventoSeleccionado()!).subscribe({
      next: (res) => {
        this.uploadProgress.set(100);
        setTimeout(() => {
          this.importResult.set(res);
          this.isUploading.set(false);
          this.notificar('¡Comunidad importada con éxito!', 'success');
        }, 500);
      },
      error: () => {
        this.isUploading.set(false);
        this.notificar('Falla en la conexión con el servidor', 'error');
      }
    });
  }

  private simularProgreso() {
    const interval = setInterval(() => {
      this.uploadProgress.update(v => (v < 90 ? v + 10 : v));
      if (this.uploadProgress() >= 90) clearInterval(interval);
    }, 100);
  }

  private notificar(mensaje: string, tipo: 'success' | 'error') {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000,
      verticalPosition: 'top',
      panelClass: tipo === 'success' ? ['bg-green-600'] : ['bg-red-600']
    });
  }

  descargarPlantilla() {
    const link = document.createElement('a');
    link.href = '/plantilla_participantes.csv';
    link.download = 'plantilla_sge_participantes.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
