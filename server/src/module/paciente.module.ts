import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteController } from '../web/rest/paciente.controller';
import { PacienteRepository } from '../repository/paciente.repository';
import { PacienteService } from '../service/paciente.service';

@Module({
    imports: [TypeOrmModule.forFeature([PacienteRepository])],
    controllers: [PacienteController],
    providers: [PacienteService],
    exports: [PacienteService],
})
export class PacienteModule {}
