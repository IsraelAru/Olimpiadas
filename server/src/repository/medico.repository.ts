import { EntityRepository, Repository } from 'typeorm';
import { Medico } from '../domain/medico.entity';

@EntityRepository(Medico)
export class MedicoRepository extends Repository<Medico> {}
