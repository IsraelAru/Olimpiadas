/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';

/**
 * A Diario.
 */
@Entity('diario')
export class Diario extends BaseEntity {
    @Column({ name: 'entrada' })
    entrada: string;

    @Column({ type: 'timestamp', name: 'fecha' })
    fecha: any;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
