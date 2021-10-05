import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoController } from '../web/rest/medico.controller';
import { MedicoRepository } from '../repository/medico.repository';
import { MedicoService } from '../service/medico.service';

@Module({
    imports: [TypeOrmModule.forFeature([MedicoRepository])],
    controllers: [MedicoController],
    providers: [MedicoService],
    exports: [MedicoService],
})
export class MedicoModule {}
