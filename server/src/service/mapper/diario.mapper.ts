import { Diario } from '../../domain/diario.entity';
import { DiarioDTO } from '../dto/diario.dto';

/**
 * A Diario mapper object.
 */
export class DiarioMapper {
    static fromDTOtoEntity(entityDTO: DiarioDTO): Diario {
        if (!entityDTO) {
            return;
        }
        const entity = new Diario();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Diario): DiarioDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new DiarioDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
