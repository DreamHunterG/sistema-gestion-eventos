export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'MONITOR' | 'PARTICIPANTE';
  estado: 'ACTIVO' | 'INACTIVO';
  // 🔑 El password ya no vive aquí para evitar fugas de datos
}

// Creamos una interfaz aparte solo para el momento de crear/editar
export interface UsuarioRequest extends Usuario {
  password?: string;
}

