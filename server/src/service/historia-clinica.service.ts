import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { HistoriaClinicaDTO } from '../service/dto/historia-clinica.dto';
import { HistoriaClinicaMapper } from '../service/mapper/historia-clinica.mapper';
import { HistoriaClinicaRepository } from '../repository/historia-clinica.repository';

const relationshipNames = [];

@Injectable()
export class HistoriaClinicaService {
    logger = new Logger('HistoriaClinicaService');

    constructor(
        @InjectRepository(HistoriaClinicaRepository) private historiaClinicaRepository: HistoriaClinicaRepository,
    ) {}

    async findById(id: string): Promise<HistoriaClinicaDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.historiaClinicaRepository.findOne(id, options);
        return HistoriaClinicaMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<HistoriaClinicaDTO>): Promise<HistoriaClinicaDTO | undefined> {
        const result = await this.historiaClinicaRepository.findOne(options);
        return HistoriaClinicaMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<HistoriaClinicaDTO>): Promise<[HistoriaClinicaDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.historiaClinicaRepository.findAndCount(options);
        const historiaClinicaDTO: HistoriaClinicaDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((historiaClinica) =>
                historiaClinicaDTO.push(HistoriaClinicaMapper.fromEntityToDTO(historiaClinica)),
            );
            resultList[0] = historiaClinicaDTO;
        }
        return resultList;
    }

    async save(historiaClinicaDTO: HistoriaClinicaDTO, creator?: string): Promise<HistoriaClinicaDTO | undefined> {
        const entity = HistoriaClinicaMapper.fromDTOtoEntity(historiaClinicaDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.historiaClinicaRepository.save(entity);
        return HistoriaClinicaMapper.fromEntityToDTO(result);
    }

    async update(historiaClinicaDTO: HistoriaClinicaDTO, updater?: string): Promise<HistoriaClinicaDTO | undefined> {
        const entity = HistoriaClinicaMapper.fromDTOtoEntity(historiaClinicaDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        await this.historiaClinicaRepository.update(entity.id, entity);
        return historiaClinicaDTO;
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.historiaClinicaRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
