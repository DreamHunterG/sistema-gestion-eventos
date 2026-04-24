export interface Evento {
  id?: number;
  nombre: string;
  fechaEvento: string;
  aforoMaximo: number;
  totalAsistentes?: number; // Viene calculado del Back
  tipoEvento: 'CAPACITACION' | 'TALLER' | 'TORNEO';
  modalidad: 'PRESENCIAL' | 'VIRTUAL';
  estado: 'ACTIVO' | 'INACTIVO';
}
