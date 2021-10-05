/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { Especialidades } from '../../domain/enumeration/especialidades';

/**
 * A MedicoDTO object.
 */
export class MedicoDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'dni field' })
    dni: number;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'matricula field' })
    matricula: string;

    @ApiModelProperty({ description: 'nombre field', required: false })
    nombre: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'apellido field' })
    apellido: string;

    @ApiModelProperty({ description: 'telefono field', required: false })
    telefono: number;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'atiendeDiscapacitados field' })
    atiendeDiscapacitados: boolean;

    @ApiModelProperty({ description: 'historiaTurnos field', required: false })
    historiaTurnos: string;

    @IsNotEmpty()
    @ApiModelProperty({ enum: Especialidades, description: 'especialidad enum field' })
    especialidad: Especialidades;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
