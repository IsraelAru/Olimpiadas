/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A PacienteDTO object.
 */
export class PacienteDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'dni field' })
    dni: number;

    @ApiModelProperty({ description: 'nombre field', required: false })
    nombre: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'apellido field' })
    apellido: string;

    @ApiModelProperty({ description: 'telefono field', required: false })
    telefono: number;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'historiaClinica field' })
    historiaClinica: string;

    @ApiModelProperty({ description: 'mail field', required: false })
    mail: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
