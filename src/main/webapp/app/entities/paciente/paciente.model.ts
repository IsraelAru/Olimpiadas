export interface IPaciente {
  id?: string;
  dni?: number;
  nombre?: string | null;
  apellido?: string;
  telefono?: number | null;
  historiaClinica?: string;
  mail?: string | null;
}

export class Paciente implements IPaciente {
  constructor(
    public id?: string,
    public dni?: number,
    public nombre?: string | null,
    public apellido?: string,
    public telefono?: number | null,
    public historiaClinica?: string,
    public mail?: string | null
  ) {}
}

export function getPacienteIdentifier(paciente: IPaciente): string | undefined {
  return paciente.id;
}
