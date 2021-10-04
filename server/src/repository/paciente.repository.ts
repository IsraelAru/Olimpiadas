import { EntityRepository, Repository } from 'typeorm';
import { Paciente } from '../domain/paciente.entity';

@EntityRepository(Paciente)
export class PacienteRepository extends Repository<Paciente> {}
