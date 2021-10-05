import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { HistoriaClinicaDTO } from '../src/service/dto/historia-clinica.dto';
import { HistoriaClinicaService } from '../src/service/historia-clinica.service';

describe('HistoriaClinica Controller', () => {
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
            .overrideProvider(HistoriaClinicaService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all historia-clinicas ', async () => {
        const getEntities: HistoriaClinicaDTO[] = (
            await request(app.getHttpServer())
                .get('/api/historia-clinicas')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET historia-clinicas by id', async () => {
        const getEntity: HistoriaClinicaDTO = (
            await request(app.getHttpServer())
                .get('/api/historia-clinicas/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create historia-clinicas', async () => {
        const createdEntity: HistoriaClinicaDTO = (
            await request(app.getHttpServer())
                .post('/api/historia-clinicas')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update historia-clinicas', async () => {
        const updatedEntity: HistoriaClinicaDTO = (
            await request(app.getHttpServer())
                .put('/api/historia-clinicas')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update historia-clinicas from id', async () => {
        const updatedEntity: HistoriaClinicaDTO = (
            await request(app.getHttpServer())
                .put('/api/historia-clinicas/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE historia-clinicas', async () => {
        const deletedEntity: HistoriaClinicaDTO = (
            await request(app.getHttpServer())
                .delete('/api/historia-clinicas/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
