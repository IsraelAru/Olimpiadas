/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Categoria } from './enumeration/categoria';

/**
 * A HistoriaClinica.
 */
@Entity('historia_clinica')
export class HistoriaClinica extends BaseEntity {
    @Column({ name: 'diagnostico' })
    diagnostico: string;

    @Column({ name: 'tratamiento' })
    tratamiento: string;

    @Column({ type: 'simple-enum', name: 'categoria', enum: Categoria })
    categoria: Categoria;

    @Column({ type: 'timestamp', name: 'fecha' })
    fecha: any;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
