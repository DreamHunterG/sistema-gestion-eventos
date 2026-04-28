export interface Participante {
  id: number;
  nombreCompleto: string;
  email: string;
  asistio: boolean;
  certificadoHash?: string;
  fechaRegistro?: string;
  evento?: any; //vinculación con el evento al que asistió, si es necesario
}
