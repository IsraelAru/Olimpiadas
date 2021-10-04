import { HistoriaClinica } from '../../domain/historia-clinica.entity';
import { HistoriaClinicaDTO } from '../dto/historia-clinica.dto';

/**
 * A HistoriaClinica mapper object.
 */
export class HistoriaClinicaMapper {
    static fromDTOtoEntity(entityDTO: HistoriaClinicaDTO): HistoriaClinica {
        if (!entityDTO) {
            return;
        }
        let entity = new HistoriaClinica();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: HistoriaClinica): HistoriaClinicaDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new HistoriaClinicaDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
