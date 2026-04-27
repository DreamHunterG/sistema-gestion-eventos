import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatTableModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  protected authService = inject(AuthService); // Inyectamos para saber quién está logueado
  private snackBar = inject(MatSnackBar);

  // --- ESTADOS DE DATOS ---
  usuarios = signal<Usuario[]>([]);
  viewMode = signal<'ACTIVO' | 'INACTIVO'>('ACTIVO'); // Controla la pestaña superior
  showFilters = signal(false);
  isFormVisible = signal(false);
  isEditing = signal(false);

  // --- FILTROS ---
  searchTerm = signal('');
  filterRol = signal('');

  // Objeto para el formulario (Ahora incluye 'nombre' por defecto)
  currentUsuario: Usuario = this.initUsuario();

  // --- MOTOR DE FILTRADO DINÁMICO (Nombre y Email) ---
  filteredUsuarios = computed(() => {
    return this.usuarios().filter(u => {
      // 1. Filtrar por estado (Vigente o Inactivo según el botón de arriba)
      if (u.estado !== this.viewMode()) return false;

      // 2. Filtrar por texto (Busca en Email O en Nombre al tiempo)
      const term = this.searchTerm().toLowerCase();
      const matchText = u.email.toLowerCase().includes(term) ||
        (u.nombre && u.nombre.toLowerCase().includes(term));

      // 3. Filtrar por Rol si hay alguno seleccionado
      const matchRol = this.filterRol() ? u.rol === this.filterRol() : true;

      return matchText && matchRol;
    });
  });

  displayedColumns: string[] = ['perfil', 'nombre', 'email', 'rol', 'actions'];

  ngOnInit() { this.cargarEquipo(); }

  cargarEquipo() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => this.usuarios.set(data),
      error: () => this.notificar('Falla al leer base de datos. Verifica el servidor.', 'error')
    });
  }

  // CUMPLIMIENTO ISO: Prevención de auto-eliminación
  onArchivar(u: Usuario) {
    if (!u.id) return;

    // 🛡️ REGLA DE SEGURIDAD SENIOR: Bloquear si es el mismo usuario de la sesión
    if (u.email === this.authService.currentUser()?.email) {
      this.notificar('Acción bloqueada: No puedes revocar tu propio acceso.', 'error');
      return;
    }

    const accion = u.estado === 'ACTIVO' ? 'archivar' : 'restaurar';
    if (confirm(`¿Desea ${accion} el acceso de ${u.nombre}?`)) {
      this.usuarioService.eliminarUsuario(u.id).subscribe(() => {
        this.notificar('Estado de acceso actualizado en el sistema', 'success');
        this.cargarEquipo();
      });
    }
  }

  onSave() {
    const request = this.isEditing()
      ? this.usuarioService.actualizarUsuario(this.currentUsuario.id!, this.currentUsuario)
      : this.usuarioService.crearUsuario(this.currentUsuario);

    request.subscribe({
      next: () => {
        this.notificar('Identidad confirmada y guardada', 'success');
        this.cargarEquipo();
        this.isFormVisible.set(false);
      },
      error: () => this.notificar('Error en el proceso de guardado', 'error')
    });
  }

  onEdit(u: Usuario) {
    this.isEditing.set(true);
    this.currentUsuario = { ...u, password: '' }; // Password vacío para no sobreescribir si no se cambia
    this.isFormVisible.set(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  toggleForm() {
    this.isFormVisible.update(v => !v);
    if (!this.isFormVisible()) {
      this.isEditing.set(false);
      this.currentUsuario = this.initUsuario();
    }
  }

  private initUsuario(): Usuario {
    return { nombre: '', email: '', password: '', rol: 'MONITOR', estado: 'ACTIVO' };
  }

  private notificar(msg: string, tipo: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? ['bg-green-600'] : ['bg-red-600']
    });
  }
}
