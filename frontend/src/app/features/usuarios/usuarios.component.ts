import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario, UsuarioRequest } from '../../models/usuario.model';
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
  protected authService = inject(AuthService); // 🛡️ Inyectamos para auditoría de auto-eliminación
  private snackBar = inject(MatSnackBar);

  // --- 📊 ESTADOS DE VISTA ---
  usuarios = signal<Usuario[]>([]);
  viewMode = signal<'ACTIVO' | 'INACTIVO'>('ACTIVO'); // 🔄 Controla si vemos equipo vigente o histórico
  showFilters = signal(false);
  isFormVisible = signal(false);
  isEditing = signal(false);

  // --- 🔍 FILTROS ---
  searchTerm = signal('');
  filterRol = signal('');

  // --- 📝 GESTIÓN DE FORMULARIO (Usa UsuarioRequest para permitir el password) ---
  currentUsuario: UsuarioRequest = this.initUsuario();

  // --- 🧠 MOTOR DE FILTRADO DINÁMICO (Busca por Nombre y Email) ---
  filteredUsuarios = computed(() => {
    return this.usuarios().filter(u => {
      // 1. Filtrar por pestaña activa (Activo/Inactivo)
      if (u.estado !== this.viewMode()) return false;

      const term = this.searchTerm().toLowerCase();
      // 2. Filtrar por texto (Busca en ambos campos)
      const matchText = u.email.toLowerCase().includes(term) ||
        (u.nombre && u.nombre.toLowerCase().includes(term));

      // 3. Filtrar por Rol seleccionado
      const matchRol = this.filterRol() ? u.rol === this.filterRol() : true;

      return matchText && matchRol;
    });
  });

  // 🔑 DEFINICIÓN DE COLUMNAS PARA LA TABLA
  displayedColumns: string[] = ['perfil', 'nombre', 'email', 'rol', 'estado', 'actions'];

  ngOnInit() { this.cargarEquipo(); }

  cargarEquipo() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => this.usuarios.set(data),
      error: () => this.notificar('Falla al conectar con el servidor. Revisa el Backend.', 'error')
    });
  }

  // --- 🎨 GESTIÓN DE COLORES DE FIGMA ---
  getRoleColor(rol: string): string {
    switch (rol) {
      case 'ADMIN': return '#005CAD';    // sge-navy
      case 'MONITOR': return '#F3E742';  // sge-achievement
      case 'INVITADO': return '#1DB6F2'; // sge-sky
      default: return '#94A3B8';         // gris
    }
  }

  getTextColor(rol: string): string {
    // Si el fondo es amarillo (Monitor), la letra es verde oscuro para contraste
    return rol === 'MONITOR' ? '#666000' : '#FFFFFF';
  }

  // --- 🚀 ACCIONES DE NEGOCIO (CRUD) ---

  // CUMPLIMIENTO HU-02: Archivado lógico y seguridad de cuenta propia
  onArchivar(u: Usuario) {
    if (!u.id) return;

    // 🛡️ REGLA DE ORO: No puedes desactivar tu propia cuenta en sesión
    if (u.email === this.authService.currentUser()?.email) {
      this.notificar('Acción bloqueada: No puedes revocar tu propio acceso.', 'error');
      return;
    }

    const accion = u.estado === 'ACTIVO' ? 'archivar' : 'restaurar';
    if (confirm(`¿Desea ${accion} el acceso de ${u.nombre}?`)) {
      this.usuarioService.eliminarUsuario(u.id).subscribe(() => {
        this.notificar('Estado de acceso actualizado en red', 'success');
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
      error: () => this.notificar('Error en el proceso. Revisa los datos.', 'error')
    });
  }

  onEdit(u: Usuario) {
    this.isEditing.set(true);
    // Clonamos los datos al formulario. El password se deja vacío por seguridad.
    this.currentUsuario = { ...u, password: '' };
    this.isFormVisible.set(true);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
  }

  toggleForm() {
    this.isFormVisible.update(v => !v);
    if (!this.isFormVisible()) {
      this.isEditing.set(false);
      this.currentUsuario = this.initUsuario();
    }
  }

  private initUsuario(): UsuarioRequest {
    return { nombre: '', email: '', password: '', rol: 'MONITOR', estado: 'ACTIVO' };
  }

  private notificar(msg: string, tipo: string) {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? ['bg-green-600'] : ['bg-red-600']
    });
  }
}
