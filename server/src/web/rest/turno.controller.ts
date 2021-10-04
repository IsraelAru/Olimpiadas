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
import { TurnoDTO } from '../../service/dto/turno.dto';
import { TurnoService } from '../../service/turno.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/turnos')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('turnos')
export class TurnoController {
    logger = new Logger('TurnoController');

    constructor(private readonly turnoService: TurnoService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: TurnoDTO,
    })
    async getAll(@Req() req: Request): Promise<TurnoDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.turnoService.findAndCount({
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
        type: TurnoDTO,
    })
    async getOne(@Param('id') id: string): Promise<TurnoDTO> {
        return await this.turnoService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create turno' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: TurnoDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() turnoDTO: TurnoDTO): Promise<TurnoDTO> {
        const created = await this.turnoService.save(turnoDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Turno', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update turno' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TurnoDTO,
    })
    async put(@Req() req: Request, @Body() turnoDTO: TurnoDTO): Promise<TurnoDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Turno', turnoDTO.id);
        return await this.turnoService.update(turnoDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update turno with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: TurnoDTO,
    })
    async putId(@Req() req: Request, @Body() turnoDTO: TurnoDTO): Promise<TurnoDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Turno', turnoDTO.id);
        return await this.turnoService.update(turnoDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete turno' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Turno', id);
        return await this.turnoService.deleteById(id);
    }
}
