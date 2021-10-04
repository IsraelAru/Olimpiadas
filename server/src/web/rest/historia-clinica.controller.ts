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
import { HistoriaClinicaDTO } from '../../service/dto/historia-clinica.dto';
import { HistoriaClinicaService } from '../../service/historia-clinica.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/historia-clinicas')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('historia-clinicas')
export class HistoriaClinicaController {
    logger = new Logger('HistoriaClinicaController');

    constructor(private readonly historiaClinicaService: HistoriaClinicaService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: HistoriaClinicaDTO,
    })
    async getAll(@Req() req: Request): Promise<HistoriaClinicaDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.historiaClinicaService.findAndCount({
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
        type: HistoriaClinicaDTO,
    })
    async getOne(@Param('id') id: string): Promise<HistoriaClinicaDTO> {
        return await this.historiaClinicaService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create historiaClinica' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: HistoriaClinicaDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() historiaClinicaDTO: HistoriaClinicaDTO): Promise<HistoriaClinicaDTO> {
        const created = await this.historiaClinicaService.save(historiaClinicaDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'HistoriaClinica', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update historiaClinica' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: HistoriaClinicaDTO,
    })
    async put(@Req() req: Request, @Body() historiaClinicaDTO: HistoriaClinicaDTO): Promise<HistoriaClinicaDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'HistoriaClinica', historiaClinicaDTO.id);
        return await this.historiaClinicaService.update(historiaClinicaDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update historiaClinica with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: HistoriaClinicaDTO,
    })
    async putId(@Req() req: Request, @Body() historiaClinicaDTO: HistoriaClinicaDTO): Promise<HistoriaClinicaDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'HistoriaClinica', historiaClinicaDTO.id);
        return await this.historiaClinicaService.update(historiaClinicaDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete historiaClinica' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'HistoriaClinica', id);
        return await this.historiaClinicaService.deleteById(id);
    }
}
