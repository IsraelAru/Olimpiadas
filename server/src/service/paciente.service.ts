import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PacienteDTO } from '../service/dto/paciente.dto';
import { PacienteMapper } from '../service/mapper/paciente.mapper';
import { PacienteRepository } from '../repository/paciente.repository';

const relationshipNames = [];

@Injectable()
export class PacienteService {
    logger = new Logger('PacienteService');

    constructor(@InjectRepository(PacienteRepository) private pacienteRepository: PacienteRepository) {}

    async findById(id: string): Promise<PacienteDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.pacienteRepository.findOne(id, options);
        return PacienteMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<PacienteDTO>): Promise<PacienteDTO | undefined> {
        const result = await this.pacienteRepository.findOne(options);
        return PacienteMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<PacienteDTO>): Promise<[PacienteDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.pacienteRepository.findAndCount(options);
        const pacienteDTO: PacienteDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(paciente => pacienteDTO.push(PacienteMapper.fromEntityToDTO(paciente)));
            resultList[0] = pacienteDTO;
        }
        return resultList;
    }

    async save(pacienteDTO: PacienteDTO, creator?: string): Promise<PacienteDTO | undefined> {
        const entity = PacienteMapper.fromDTOtoEntity(pacienteDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.pacienteRepository.save(entity);
        return PacienteMapper.fromEntityToDTO(result);
    }

    async update(pacienteDTO: PacienteDTO, updater?: string): Promise<PacienteDTO | undefined> {
        const entity = PacienteMapper.fromDTOtoEntity(pacienteDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        await this.pacienteRepository.update(entity.id, entity);
        return pacienteDTO;
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.pacienteRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
