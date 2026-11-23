import { Component, OnInit, inject, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 🔑 IMPORTACIÓN CORREGIDA PARA V3 (STANDALONE)
import {
  NgxScannerQrcodeComponent,
  ScannerQRCodeConfig,
  LOAD_WASM,
  ScannerQRCodeResult
} from 'ngx-scanner-qrcode';
import { EventoService } from '../../services/evento.service';
import { ParticipanteService } from '../../services/participante.service';
import { Evento } from '../../models/evento.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

// Inicializar motor de visión de la librería
LOAD_WASM().subscribe();

@Component({
  selector: 'app-escanner',
  standalone: true,
  // 🔑 SE AGREGA NgxScannerQrcodeComponent AQUÍ EN LUGAR DEL MODULE
  imports: [
    CommonModule,
    FormsModule,
    NgxScannerQrcodeComponent,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  templateUrl: './escanner.component.html',
  styleUrl: './escanner.component.scss'
})
export class EscannerComponent implements OnInit {
  @ViewChild('action') scanner!: NgxScannerQrcodeComponent;

  private eventoService = inject(EventoService);
  private participanteService = inject(ParticipanteService);
  private snackBar = inject(MatSnackBar);

  // --- ESTADOS ---
  eventos = signal<Evento[]>([]);
  eventoSeleccionado = signal<number | null>(null);
  participantes = signal<any[]>([]);
  searchTerm = signal('');

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }
  };

  // Motor de búsqueda manual
  filteredParticipantes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.participantes().filter(p =>
      p.persona.nombreCompleto.toLowerCase().includes(term) ||
      p.persona.email.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.eventoService.getEventos().subscribe(data => this.eventos.set(data));
  }

  onEventoChange(id: number) {
    this.eventoSeleccionado.set(id);
    this.cargarLista();
  }

  cargarLista() {
    this.participanteService.getParticipantes().subscribe({
      next: (data: any[]) => {
        this.participantes.set(data.filter(p => p.evento.id === this.eventoSeleccionado()));
      }
    });
  }

  // HU-13: Evento al detectar un código QR
  public onEvent(e: ScannerQRCodeResult[], action: any): void {
    if (e && e.length > 0 && e[0].value) {
      const id = e[0].value;
      this.procesarIngreso(id);
    }
  }

  // Lógica Unificada (QR + Manual)
  procesarIngreso(idInscripcion: any) {
    if (!this.eventoSeleccionado()) {
      this.notificar('⚠️ Selecciona primero el evento destino', 'error');
      return;
    }

    this.participanteService.registrarAsistencia(Number(idInscripcion), this.eventoSeleccionado()!).subscribe({
      next: (res) => {
        this.notificar(`✅ BIENVENIDO: ${res.persona.nombreCompleto}`, 'success');
        this.cargarLista();
        this.searchTerm.set('');
      },
      error: () => this.notificar('❌ Código no válido o ya registrado', 'error')
    });
  }

  private notificar(msg: string, tipo: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? ['bg-green-600', 'text-white'] : ['bg-red-600', 'text-white']
    });
  }
}
