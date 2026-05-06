export interface Participante {
  id: number;
  persona: {
    nombreCompleto: string;
    email: string;
  };
  asistio: boolean;
  certificadoHash?: string;
  evento?: {
    id: number;
    nombre: string;
    tipoEvento: string;
  };
}
