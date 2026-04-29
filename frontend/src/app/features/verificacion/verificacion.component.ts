import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import * as confetti from 'canvas-confetti';

@Component({
  selector: 'app-verificacion',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './verificacion.component.html',
  styleUrl: './verificacion.component.scss'
})
export class VerificacionComponent {
  private http = inject(HttpClient);

  query = '';
  resultados = signal<any[]>([]);
  busquedaRealizada = signal(false);
  loading = signal(false);

  // HU-19: Consultar autenticidad de logros
  consultar() {
    if (!this.query || this.query.length < 3) return;

    this.loading.set(true);
    this.busquedaRealizada.set(false);

    // Detectamos si es una búsqueda por Email o por Hash SHA-256
    const isEmail = this.query.includes('@');
    const url = isEmail
      ? `http://localhost:8080/api/public/mis-certificados/${this.query.trim()}`
      : `http://localhost:8080/api/public/validar/${this.query.trim()}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        // Convertimos cualquier respuesta en una lista para la tabla
        const data = Array.isArray(res) ? res : (res.valido ? [res] : []);
        this.resultados.set(data);
        this.busquedaRealizada.set(true);
        this.loading.set(false);

        // 🚀 Si hay éxito, disparamos la celebración gamificada
        if (data.length > 0) {
          this.ejecutarCelebracion();
        }
      },
      error: () => {
        this.resultados.set([]);
        this.busquedaRealizada.set(true);
        this.loading.set(false);
      }
    });
  }

  // HU-18: Descarga de documento inmutable
  descargar(id: number) {
    if (!id) return;
    window.open(`http://localhost:8080/api/public/download/${id}`, '_blank');
  }

  private ejecutarCelebracion() {
    // 1. GESTIÓN DE AUDIO (Con tu archivo específico)
    try {
      const audio = new Audio('sounds/success.mp3'); // 🔑 Sin la palabra 'assets' // 🔑 Reemplaza con tu sonido de éxito
      audio.load();
      audio.volume = 0.6;

      // El navegador permite el play porque viene de un clic del usuario (consultar)
      audio.play().catch(e => console.warn("Audio bloqueado por el navegador hasta interacción física"));
    } catch (err) {
      console.error("Error al reproducir el sonido de éxito", err);
    }

    // 2. EXPLOSIÓN DE CONFETI (Colores de tu Branding)
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Lanzamiento desde la izquierda
      confetti.default({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#0583F2', '#F3E742', '#005CAD']
      });

      // Lanzamiento desde la derecha
      confetti.default({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#0583F2', '#F3E742', '#005CAD']
      });
    }, 250);
  }
}
