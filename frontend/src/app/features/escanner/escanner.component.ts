import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 🔑 IMPORTACIÓN ACTUALIZADA: Eliminamos el Module y usamos el Component directamente
import { NgxScannerQrcodeComponent, ScannerQRCodeConfig, LOAD_WASM } from 'ngx-scanner-qrcode';
import { ParticipanteService } from '../../services/participante.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

// 🚀 INICIALIZACIÓN: Motor de visión para el navegador
LOAD_WASM().subscribe();

@Component({
  selector: 'app-escanner',
  standalone: true,
  // 🔑 ARRAY DE IMPORTS CORREGIDO: Usamos el componente directo
  imports: [
    CommonModule,
    FormsModule,
    NgxScannerQrcodeComponent,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './escanner.component.html',
  styleUrl: './escanner.component.scss'
})
export class EscannerComponent {
  @ViewChild('action') scanner!: NgxScannerQrcodeComponent;
  private participanteService = inject(ParticipanteService);
  private snackBar = inject(MatSnackBar);

  idManual = ''; // ⌨️ Contingencia manual para el monitor

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'environment' // Prioriza cámara trasera en móviles
      }
    }
  };

  // HU-13: Detección automática por cámara
  public onEvent(e: any): void {
    if (e && e[0] && e[0].value) {
      const id = e[0].value;
      this.procesarIngreso(id);
    }
  }

  // Lógica Unificada de Check-in (Cámara o Teclado)
  procesarIngreso(id: string | number) {
    if (!id) return;

    this.participanteService.registrarAsistencia(Number(id)).subscribe({
      next: (res) => {
        this.snackBar.open(`✅ ¡BIENVENIDO! Logro validado: ${res.persona.nombreCompleto}`, 'Cerrar', {
          duration: 3000,
          panelClass: ['bg-green-600', 'text-white']
        });
        this.idManual = '';

        // Pausar y reiniciar para dar feedback visual
        if (this.scanner.isStart) this.scanner.pause();
        setTimeout(() => { if (this.scanner.isStart) this.scanner.play(); }, 2000);
      },
      error: () => {
        this.snackBar.open('❌ ERROR: Código inválido o ya registrado', 'Cerrar', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white']
        });
      }
    });
  }
}
