import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { TurnoDTO } from '../service/dto/turno.dto';
import { TurnoMapper } from '../service/mapper/turno.mapper';
import { TurnoRepository } from '../repository/turno.repository';

const relationshipNames = [];

@Injectable()
export class TurnoService {
    logger = new Logger('TurnoService');

    constructor(@InjectRepository(TurnoRepository) private turnoRepository: TurnoRepository) {}

    async findById(id: string): Promise<TurnoDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.turnoRepository.findOne(id, options);
        return TurnoMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<TurnoDTO>): Promise<TurnoDTO | undefined> {
        const result = await this.turnoRepository.findOne(options);
        return TurnoMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<TurnoDTO>): Promise<[TurnoDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.turnoRepository.findAndCount(options);
        const turnoDTO: TurnoDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(turno => turnoDTO.push(TurnoMapper.fromEntityToDTO(turno)));
            resultList[0] = turnoDTO;
        }
        return resultList;
    }

    async save(turnoDTO: TurnoDTO, creator?: string): Promise<TurnoDTO | undefined> {
        const entity = TurnoMapper.fromDTOtoEntity(turnoDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.turnoRepository.save(entity);
        return TurnoMapper.fromEntityToDTO(result);
    }

    async update(turnoDTO: TurnoDTO, updater?: string): Promise<TurnoDTO | undefined> {
        const entity = TurnoMapper.fromDTOtoEntity(turnoDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        await this.turnoRepository.update(entity.id, entity);
        return turnoDTO;
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.turnoRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
