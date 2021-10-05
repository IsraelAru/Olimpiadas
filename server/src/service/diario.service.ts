import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { DiarioDTO } from '../service/dto/diario.dto';
import { DiarioMapper } from '../service/mapper/diario.mapper';
import { DiarioRepository } from '../repository/diario.repository';

const relationshipNames = [];

@Injectable()
export class DiarioService {
    logger = new Logger('DiarioService');

    constructor(@InjectRepository(DiarioRepository) private diarioRepository: DiarioRepository) {}

    async findById(id: string): Promise<DiarioDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.diarioRepository.findOne(id, options);
        return DiarioMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<DiarioDTO>): Promise<DiarioDTO | undefined> {
        const result = await this.diarioRepository.findOne(options);
        return DiarioMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<DiarioDTO>): Promise<[DiarioDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.diarioRepository.findAndCount(options);
        const diarioDTO: DiarioDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(diario => diarioDTO.push(DiarioMapper.fromEntityToDTO(diario)));
            resultList[0] = diarioDTO;
        }
        return resultList;
    }

    async save(diarioDTO: DiarioDTO, creator?: string): Promise<DiarioDTO | undefined> {
        const entity = DiarioMapper.fromDTOtoEntity(diarioDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.diarioRepository.save(entity);
        return DiarioMapper.fromEntityToDTO(result);
    }

    async update(diarioDTO: DiarioDTO, updater?: string): Promise<DiarioDTO | undefined> {
        const entity = DiarioMapper.fromDTOtoEntity(diarioDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        await this.diarioRepository.update(entity.id, entity);
        return diarioDTO;
    }

    async deleteById(id: string): Promise<void | undefined> {
        await this.diarioRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
