import { Turno } from '../../domain/turno.entity';
import { TurnoDTO } from '../dto/turno.dto';

/**
 * A Turno mapper object.
 */
export class TurnoMapper {
    static fromDTOtoEntity(entityDTO: TurnoDTO): Turno {
        if (!entityDTO) {
            return;
        }
        let entity = new Turno();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Turno): TurnoDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new TurnoDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
