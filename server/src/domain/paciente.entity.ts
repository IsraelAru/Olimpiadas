/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Paciente.
 */
@Entity('paciente')
export class Paciente extends BaseEntity {
    @Column({ type: 'integer', name: 'dni' })
    dni: number;

    @Column({ name: 'nombre', nullable: true })
    nombre: string;

    @Column({ name: 'apellido' })
    apellido: string;

    @Column({ type: 'integer', name: 'telefono', nullable: true })
    telefono: number;

    @Column({ name: 'historia_clinica' })
    historiaClinica: string;

    @Column({ name: 'mail', nullable: true })
    mail: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
