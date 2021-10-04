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
import { DiarioDTO } from '../../service/dto/diario.dto';
import { DiarioService } from '../../service/diario.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/diarios')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('diarios')
export class DiarioController {
    logger = new Logger('DiarioController');

    constructor(private readonly diarioService: DiarioService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: DiarioDTO,
    })
    async getAll(@Req() req: Request): Promise<DiarioDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.diarioService.findAndCount({
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
        type: DiarioDTO,
    })
    async getOne(@Param('id') id: string): Promise<DiarioDTO> {
        return await this.diarioService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create diario' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: DiarioDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() diarioDTO: DiarioDTO): Promise<DiarioDTO> {
        const created = await this.diarioService.save(diarioDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Diario', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update diario' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: DiarioDTO,
    })
    async put(@Req() req: Request, @Body() diarioDTO: DiarioDTO): Promise<DiarioDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Diario', diarioDTO.id);
        return await this.diarioService.update(diarioDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update diario with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: DiarioDTO,
    })
    async putId(@Req() req: Request, @Body() diarioDTO: DiarioDTO): Promise<DiarioDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Diario', diarioDTO.id);
        return await this.diarioService.update(diarioDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete diario' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Diario', id);
        return await this.diarioService.deleteById(id);
    }
}
