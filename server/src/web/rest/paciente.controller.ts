import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PacienteDTO } from '../../service/dto/paciente.dto';
import { PacienteService } from '../../service/paciente.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/pacientes')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('pacientes')
export class PacienteController {
    logger = new Logger('PacienteController');

    constructor(private readonly pacienteService: PacienteService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: PacienteDTO,
    })
    async getAll(@Req() req: Request): Promise<PacienteDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.pacienteService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: PacienteDTO,
    })
    async getOne(@Param('id') id: string): Promise<PacienteDTO> {
        return await this.pacienteService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create paciente' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: PacienteDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() pacienteDTO: PacienteDTO): Promise<PacienteDTO> {
        const created = await this.pacienteService.save(pacienteDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Paciente', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update paciente' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PacienteDTO,
    })
    async put(@Req() req: Request, @Body() pacienteDTO: PacienteDTO): Promise<PacienteDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Paciente', pacienteDTO.id);
        return await this.pacienteService.update(pacienteDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update paciente with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: PacienteDTO,
    })
    async putId(@Req() req: Request, @Body() pacienteDTO: PacienteDTO): Promise<PacienteDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Paciente', pacienteDTO.id);
        return await this.pacienteService.update(pacienteDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete paciente' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Paciente', id);
        return await this.pacienteService.deleteById(id);
    }
}
