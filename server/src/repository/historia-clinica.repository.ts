import { EntityRepository, Repository } from 'typeorm';
import { HistoriaClinica } from '../domain/historia-clinica.entity';

@EntityRepository(HistoriaClinica)
export class HistoriaClinicaRepository extends Repository<HistoriaClinica> {}
