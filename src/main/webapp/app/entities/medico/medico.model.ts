import { Especialidades } from 'app/entities/enumerations/especialidades.model';

export interface IMedico {
  id?: string;
  dni?: number;
  matricula?: string;
  nombre?: string | null;
  apellido?: string;
  telefono?: number | null;
  atiendeDiscapacitados?: boolean;
  historiaTurnos?: string | null;
  especialidad?: Especialidades;
}

export class Medico implements IMedico {
  constructor(
    public id?: string,
    public dni?: number,
    public matricula?: string,
    public nombre?: string | null,
    public apellido?: string,
    public telefono?: number | null,
    public atiendeDiscapacitados?: boolean,
    public historiaTurnos?: string | null,
    public especialidad?: Especialidades
  ) {
    this.atiendeDiscapacitados = this.atiendeDiscapacitados ?? false;
  }
}

export function getMedicoIdentifier(medico: IMedico): string | undefined {
  return medico.id;
}
