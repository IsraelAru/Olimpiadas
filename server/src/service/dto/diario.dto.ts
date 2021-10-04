/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

/**
 * A DiarioDTO object.
 */
export class DiarioDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'entrada field' })
    entrada: string;

    @IsNotEmpty()
    @ApiModelProperty({ description: 'fecha field' })
    fecha: any;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
