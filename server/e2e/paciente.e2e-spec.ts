import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { PacienteDTO } from '../src/service/dto/paciente.dto';
import { PacienteService } from '../src/service/paciente.service';

describe('Paciente Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(PacienteService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all pacientes ', async () => {
        const getEntities: PacienteDTO[] = (await request(app.getHttpServer()).get('/api/pacientes').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET pacientes by id', async () => {
        const getEntity: PacienteDTO = (
            await request(app.getHttpServer())
                .get('/api/pacientes/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create pacientes', async () => {
        const createdEntity: PacienteDTO = (
            await request(app.getHttpServer()).post('/api/pacientes').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update pacientes', async () => {
        const updatedEntity: PacienteDTO = (
            await request(app.getHttpServer()).put('/api/pacientes').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update pacientes from id', async () => {
        const updatedEntity: PacienteDTO = (
            await request(app.getHttpServer())
                .put('/api/pacientes/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE pacientes', async () => {
        const deletedEntity: PacienteDTO = (
            await request(app.getHttpServer())
                .delete('/api/pacientes/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
