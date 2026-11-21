import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-recompensa',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './recompensa.component.html', // 🔑 Sincronizado
  styleUrl: './recompensa.component.scss'
})
export class RecompensaComponent implements OnInit {
  // Inyectamos la referencia del modal para poder cerrarlo
  public dialogRef = inject(MatDialogRef<RecompensaComponent>);

  // Temas visuales para variar los fondos
  private temas = [
    { bg: 'bg-[#001C3B]', text: 'text-white', accent: 'text-[#F3E742]', icon: 'workspace_premium' },
    { bg: 'bg-[#666000]', text: 'text-white', accent: 'text-[#F3E742]', icon: 'stars' },
    { bg: 'bg-[#0583F2]', text: 'text-white', accent: 'text-white', icon: 'military_tech' },
    { bg: 'bg-[#005CAD]', text: 'text-white', accent: 'text-[#F3E742]', icon: 'verified_user' }
  ];

  private frases = [
    "Un certificado es la llave de la próxima gran oportunidad para alguien.",
    "Detrás de cada registro hay una persona esperando ser reconocida.",
    "La educación es poderosa, y tu sistema garantiza su veracidad.",
    "El éxito de un evento se mide en los logros que validas.",
    "Tu trabajo hoy construye la red de confianza de mañana.",
    "Validar el conocimiento es la forma más alta de respeto.",
    "Cada código QR escaneado es una historia de aprendizaje exitosa.",
    "Eres el guardián de la integridad académica de tu comunidad.",
    "La excelencia nace al cuidar cada detalle del proceso.",
    "¡Lo estás logrando! Has construido un ecosistema de mérito real."
  ];

  // Definimos las señales (Signals) que el HTML va a leer
  public config = signal(this.temas[Math.floor(Math.random() * this.temas.length)]);
  public frase = signal(this.frases[Math.floor(Math.random() * this.frases.length)]);

  ngOnInit() {
    this.lanzarCelebracion();
  }

  private lanzarCelebracion() {
    // 🔊 Sonido de confeti. El navegador lo permite porque el modal se abre con un clic del usuario.
    const audio = new Audio('sounds/confetti.wav');
    audio.volume = 0.6;
    audio.play().catch(() => console.warn('Audio bloqueado por el navegador'));

    // 🎉 Confeti. zIndex 1100 para quedar por encima del modal de Angular Material (z-index 1000).
    confetti.default({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0583F2', '#F3E742', '#005CAD'],
      zIndex: 1100
    });
  }

  cerrar() {
    this.dialogRef.close();
  }
}
