import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiarioController } from '../web/rest/diario.controller';
import { DiarioRepository } from '../repository/diario.repository';
import { DiarioService } from '../service/diario.service';

@Module({
    imports: [TypeOrmModule.forFeature([DiarioRepository])],
    controllers: [DiarioController],
    providers: [DiarioService],
    exports: [DiarioService],
})
export class DiarioModule {}
