export interface Evento {
  id?: number;
  nombre: string;
  fechaEvento: string;
  aforoMaximo: number;
  tipoEvento: 'CAPACITACION' | 'TALLER' | 'TORNEO';
  estado?: string;
}
