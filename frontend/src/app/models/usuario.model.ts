export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  rol: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

// 🔑 Esta interfaz extiende a la anterior y SÍ permite la contraseña
export interface UsuarioRequest extends Usuario {
  password?: string;
}
