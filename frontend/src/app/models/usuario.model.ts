export interface Usuario {
  id?: number;
  email: string;
  rol: 'ADMIN' | 'MONITOR' | 'PARTICIPANTE';
}
