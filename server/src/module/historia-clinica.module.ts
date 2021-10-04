import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriaClinicaController } from '../web/rest/historia-clinica.controller';
import { HistoriaClinicaRepository } from '../repository/historia-clinica.repository';
import { HistoriaClinicaService } from '../service/historia-clinica.service';

@Module({
    imports: [TypeOrmModule.forFeature([HistoriaClinicaRepository])],
    controllers: [HistoriaClinicaController],
    providers: [HistoriaClinicaService],
    exports: [HistoriaClinicaService],
})
export class HistoriaClinicaModule {}
