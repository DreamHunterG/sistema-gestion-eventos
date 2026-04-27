export interface Usuario {
  id?: number;
  nombre: string;    // 🔑 Campo sincronizado con el SQL de hace un momento
  email: string;
  password?: string; // Opcional (solo para creación/edición)
  rol: 'ADMIN' | 'MONITOR' | 'PARTICIPANTE';
  estado: 'ACTIVO' | 'INACTIVO'; // 🔑 Campo para el archivado lógico
}
