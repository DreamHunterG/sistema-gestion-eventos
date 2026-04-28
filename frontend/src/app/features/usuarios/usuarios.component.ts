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
  protected authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  usuarios = signal<Usuario[]>([]);
  viewMode = signal<'ACTIVO' | 'INACTIVO'>('ACTIVO');
  showFilters = signal(false);
  isFormVisible = signal(false);
  isEditing = signal(false);
  searchTerm = signal('');
  filterRol = signal('');

  // 🔑 SOLUCIÓN AL ERROR TS2353: Usamos UsuarioRequest
  currentUsuario: UsuarioRequest = this.initUsuario();

  filteredUsuarios = computed(() => {
    return this.usuarios().filter(u => {
      if (u.estado !== this.viewMode()) return false;
      const term = this.searchTerm().toLowerCase();
      const matchText = u.email.toLowerCase().includes(term) || (u.nombre && u.nombre.toLowerCase().includes(term));
      const matchRol = this.filterRol() ? u.rol === this.filterRol() : true;
      return matchText && matchRol;
    });
  });

  displayedColumns: string[] = ['perfil', 'nombre', 'email', 'rol', 'actions'];

  ngOnInit() { this.cargarEquipo(); }

  cargarEquipo() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => this.usuarios.set(data),
      error: () => this.notificar('Falla al conectar con el servidor', 'error')
    });
  }

  onArchivar(u: Usuario) {
    if (u.email === this.authService.currentUser()?.email) {
      this.notificar('Acción bloqueada: No puedes desactivar tu propia cuenta.', 'error');
      return;
    }
    if (confirm(`¿Desea cambiar el estado de acceso de ${u.nombre}?`)) {
      this.usuarioService.eliminarUsuario(u.id!).subscribe(() => {
        this.notificar('Estado actualizado', 'success');
        this.cargarEquipo();
      });
    }
  }

  onSave() {
    const req = this.isEditing()
      ? this.usuarioService.actualizarUsuario(this.currentUsuario.id!, this.currentUsuario)
      : this.usuarioService.crearUsuario(this.currentUsuario);

    req.subscribe({
      next: () => {
        this.notificar('Registro actualizado con éxito', 'success');
        this.cargarEquipo();
        this.isFormVisible.set(false);
      }
    });
  }

  onEdit(u: Usuario) {
    this.isEditing.set(true);
    // Clonamos el objeto de la lista al objeto del formulario permitiendo el password
    this.currentUsuario = { ...u, password: '' };
    this.isFormVisible.set(true);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
  }

  toggleForm() {
    this.isFormVisible.update(v => !v);
    this.isEditing.set(false);
    this.currentUsuario = this.initUsuario();
  }

  private initUsuario(): UsuarioRequest {
    return { nombre: '', email: '', password: '', rol: 'MONITOR', estado: 'ACTIVO' };
  }

  private notificar(msg: string, tipo: string) {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000, panelClass: tipo === 'success' ? ['bg-green-600'] : ['bg-red-600'] });
  }
}
