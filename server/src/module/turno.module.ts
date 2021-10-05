import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnoController } from '../web/rest/turno.controller';
import { TurnoRepository } from '../repository/turno.repository';
import { TurnoService } from '../service/turno.service';

@Module({
    imports: [TypeOrmModule.forFeature([TurnoRepository])],
    controllers: [TurnoController],
    providers: [TurnoService],
    exports: [TurnoService],
})
export class TurnoModule {}
