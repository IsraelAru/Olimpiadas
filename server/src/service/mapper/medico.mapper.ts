import { Medico } from '../../domain/medico.entity';
import { MedicoDTO } from '../dto/medico.dto';

/**
 * A Medico mapper object.
 */
export class MedicoMapper {
    static fromDTOtoEntity(entityDTO: MedicoDTO): Medico {
        if (!entityDTO) {
            return;
        }
        let entity = new Medico();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Medico): MedicoDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new MedicoDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
