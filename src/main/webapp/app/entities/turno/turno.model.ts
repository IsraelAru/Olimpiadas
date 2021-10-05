import * as dayjs from 'dayjs';
import { TurnoEstado } from 'app/entities/enumerations/turno-estado.model';

export interface ITurno {
  id?: string;
  estado?: TurnoEstado;
  fechaHora?: dayjs.Dayjs;
  motivo?: string;
  descripcion?: string | null;
}

export class Turno implements ITurno {
  constructor(
    public id?: string,
    public estado?: TurnoEstado,
    public fechaHora?: dayjs.Dayjs,
    public motivo?: string,
    public descripcion?: string | null
  ) {}
}

export function getTurnoIdentifier(turno: ITurno): string | undefined {
  return turno.id;
}
