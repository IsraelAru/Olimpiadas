import { Paciente } from '../../domain/paciente.entity';
import { PacienteDTO } from '../dto/paciente.dto';

/**
 * A Paciente mapper object.
 */
export class PacienteMapper {
    static fromDTOtoEntity(entityDTO: PacienteDTO): Paciente {
        if (!entityDTO) {
            return;
        }
        let entity = new Paciente();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Paciente): PacienteDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new PacienteDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
