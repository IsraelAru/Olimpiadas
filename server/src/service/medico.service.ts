import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { MedicoDTO } from '../service/dto/medico.dto';
import { MedicoMapper } from '../service/mapper/medico.mapper';
import { MedicoRepository } from '../repository/medico.repository';

const relationshipNames = [];

@Injectable()
export class MedicoService {
    logger = new Logger('MedicoService');

    constructor(@InjectRepository(MedicoRepository) private medicoRepository: MedicoRepository) {}

    async findById(id: string): Promise<MedicoDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.medicoRepository.findOne(id, options);
        return MedicoMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<MedicoDTO>): Promise<MedicoDTO | undefined> {
        const result = await this.medicoRepository.findOne(options);
        return MedicoMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<MedicoDTO>): Promise<[MedicoDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.medicoRepository.findAndCount(options);
        const medicoDTO: MedicoDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(medico => medicoDTO.push(MedicoMapper.fromEntityToDTO(medico)));
            resultList[0] = medicoDTO;
        }
        return resultList;
    }

    async save(medicoDTO: MedicoDTO, creator?: string): Promise<MedicoDTO | undefined> {
        const entity = MedicoMapper.fromDTOtoEntity(medicoDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.medicoRepository.save(entity);
        return MedicoMapper.fromEntityToDTO(result);
    }

    async update(medicoDTO: MedicoDTO, updater?: string): Promise<MedicoDTO | undefined> {
        const entity = MedicoMapper.fromDTOtoEntity(medicoDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        await this.medicoRepository.update(entity.id, entity);
        return medicoDTO;
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.medicoRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
