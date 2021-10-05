import { EntityRepository, Repository } from 'typeorm';
import { Diario } from '../domain/diario.entity';

@EntityRepository(Diario)
export class DiarioRepository extends Repository<Diario> {}
