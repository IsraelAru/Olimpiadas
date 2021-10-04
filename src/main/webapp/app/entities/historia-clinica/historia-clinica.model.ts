import * as dayjs from 'dayjs';
import { Categoria } from 'app/entities/enumerations/categoria.model';

export interface IHistoriaClinica {
  id?: string;
  diagnostico?: string;
  tratamiento?: string;
  categoria?: Categoria;
  fecha?: dayjs.Dayjs;
}

export class HistoriaClinica implements IHistoriaClinica {
  constructor(
    public id?: string,
    public diagnostico?: string,
    public tratamiento?: string,
    public categoria?: Categoria,
    public fecha?: dayjs.Dayjs
  ) {}
}

export function getHistoriaClinicaIdentifier(historiaClinica: IHistoriaClinica): string | undefined {
  return historiaClinica.id;
}
