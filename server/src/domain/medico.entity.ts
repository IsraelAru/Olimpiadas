/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Especialidades } from './enumeration/especialidades';

/**
 * A Medico.
 */
@Entity('medico')
export class Medico extends BaseEntity {
    @Column({ type: 'integer', name: 'dni' })
    dni: number;

    @Column({ name: 'matricula' })
    matricula: string;

    @Column({ name: 'nombre', nullable: true })
    nombre: string;

    @Column({ name: 'apellido' })
    apellido: string;

    @Column({ type: 'integer', name: 'telefono', nullable: true })
    telefono: number;

    @Column({ type: 'boolean', name: 'atiende_discapacitados' })
    atiendeDiscapacitados: boolean;

    @Column({ name: 'historia_turnos', nullable: true })
    historiaTurnos: string;

    @Column({ type: 'simple-enum', name: 'especialidad', enum: Especialidades })
    especialidad: Especialidades;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
