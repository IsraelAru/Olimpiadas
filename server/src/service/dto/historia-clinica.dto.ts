/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { Categoria } from '../../domain/enumeration/categoria';

/**
 * A HistoriaClinicaDTO object.
 */
export class HistoriaClinicaDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'diagnostico field' })
    diagnostico: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'tratamiento field' })
    tratamiento: string;

    @IsNotEmpty()
    @ApiModelProperty({ enum: Categoria, description: 'categoria enum field' })
    categoria: Categoria;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'fecha field' })
    fecha: any;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
