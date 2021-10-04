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
import { MedicoDTO } from '../../service/dto/medico.dto';
import { MedicoService } from '../../service/medico.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/medicos')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('medicos')
export class MedicoController {
    logger = new Logger('MedicoController');

    constructor(private readonly medicoService: MedicoService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: MedicoDTO,
    })
    async getAll(@Req() req: Request): Promise<MedicoDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.medicoService.findAndCount({
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
        type: MedicoDTO,
    })
    async getOne(@Param('id') id: string): Promise<MedicoDTO> {
        return await this.medicoService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create medico' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: MedicoDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() medicoDTO: MedicoDTO): Promise<MedicoDTO> {
        const created = await this.medicoService.save(medicoDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Medico', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update medico' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: MedicoDTO,
    })
    async put(@Req() req: Request, @Body() medicoDTO: MedicoDTO): Promise<MedicoDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Medico', medicoDTO.id);
        return await this.medicoService.update(medicoDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update medico with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: MedicoDTO,
    })
    async putId(@Req() req: Request, @Body() medicoDTO: MedicoDTO): Promise<MedicoDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Medico', medicoDTO.id);
        return await this.medicoService.update(medicoDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete medico' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Medico', id);
        return await this.medicoService.deleteById(id);
    }
}
