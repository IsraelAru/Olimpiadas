import * as dayjs from 'dayjs';

export interface IDiario {
  id?: string;
  entrada?: string;
  fecha?: dayjs.Dayjs;
}

export class Diario implements IDiario {
  constructor(public id?: string, public entrada?: string, public fecha?: dayjs.Dayjs) {}
}

export function getDiarioIdentifier(diario: IDiario): string | undefined {
  return diario.id;
}
