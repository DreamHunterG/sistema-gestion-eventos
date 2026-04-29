import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxScannerQrcodeComponent, ScannerQRCodeConfig, LOAD_WASM } from 'ngx-scanner-qrcode';
import { ParticipanteService } from '../../services/participante.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

// 🔑 CARGA CRÍTICA: Motor para que la cámara reconozca imágenes
LOAD_WASM().subscribe();

@Component({
  selector: 'app-escanner',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxScannerQrcodeComponent, MatIconModule, MatSnackBarModule],
  templateUrl: './escanner.component.html',
  styleUrls: ['./escanner.component.scss']
})
//aqui se maneja el escaneo de QR y el ingreso manual para registrar la asistencia
// de los participantes. Al detectar un código QR válido, se muestra un
// mensaje de bienvenida con el nombre del participante.
// Si el código es inválido o ya registrado, se muestra un mensaje de error.
// Además, se pausa la cámara por un momento para dar feedback visual al usuario.
export class EscannerComponent {
  @ViewChild('action') scanner!: NgxScannerQrcodeComponent;
  private participanteService = inject(ParticipanteService);
  private snackBar = inject(MatSnackBar);

  idManual = ''; // ⌨️ Para cuando falla el QR

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'environment'
      }
    }
  };

  // HU-13: Al detectar un código con la cámara
  public onEvent(e: any): void {
    if (e && e[0] && e[0].value) {
      const id = e[0].value;
      this.procesarIngreso(id);
    }
  }

  // Lógica Unificada (QR + Manual)
  procesarIngreso(id: string | number) {
    if (!id) return;

    this.participanteService.registrarAsistencia(Number(id)).subscribe({
      next: (res) => {
        this.snackBar.open(`✅ ¡BIENVENIDO! Logro validado: ${res.nombreCompleto}`, 'Cerrar', {
          duration: 3000, panelClass: ['bg-green-600', 'text-white']
        });
        this.idManual = '';
        if (this.scanner.isStart) this.scanner.pause(); // Pausamos un segundo para feedback
        setTimeout(() => { if (this.scanner.isStart) this.scanner.play(); }, 2000);
      },
      error: () => {
        this.snackBar.open('❌ ERROR: Código inválido o ya registrado', 'Cerrar', {
          duration: 3000, panelClass: ['bg-red-600', 'text-white']
        });
      }
    });
  }
}
