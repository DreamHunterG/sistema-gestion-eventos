export interface Participante {
  id: number;
  persona: {
    nombreCompleto: string;
    email: string;
  };
  evento: {
    id: number;
    nombre: string;
  };
  asistio: boolean;
  certificadoHash?: string;
  // Propiedades virtuales para que tu HTML actual no se rompa
  nombreCompleto?: string;
  email?: string;
}
