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

@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [
    CommonModule, MatIconModule, MatButtonModule,
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
  uploadProgress = signal<number>(0); // Para la barra de carga del Figma
  importResult = signal<ImportResponse | null>(null);

  ngOnInit() {
    this.eventoService.getEventos().subscribe({
      next: (data) => this.eventos.set(data),
      error: () => this.notificar('No se pudieron cargar los eventos', 'error')
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      this.selectedFile.set(file);
      this.importResult.set(null);
      this.uploadProgress.set(0);
    } else {
      this.notificar('Por favor, selecciona un archivo .CSV válido', 'error');
    }
  }

  procesarArchivo() {
    if (!this.selectedFile() || !this.eventoSeleccionado()) {
      this.notificar('Faltan datos: Selecciona evento y archivo', 'error');
      return;
    }

    this.isUploading.set(true);
    this.simularProgreso(); // Efecto visual para el usuario

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
      panelClass: tipo === 'success' ? ['toast-success'] : ['toast-error']
    });
  }
}
