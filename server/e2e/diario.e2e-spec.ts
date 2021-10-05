import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { DiarioDTO } from '../src/service/dto/diario.dto';
import { DiarioService } from '../src/service/diario.service';

describe('Diario Controller', () => {
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
            .overrideProvider(DiarioService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all diarios ', async () => {
        const getEntities: DiarioDTO[] = (
            await request(app.getHttpServer())
                .get('/api/diarios')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET diarios by id', async () => {
        const getEntity: DiarioDTO = (
            await request(app.getHttpServer())
                .get('/api/diarios/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create diarios', async () => {
        const createdEntity: DiarioDTO = (
            await request(app.getHttpServer())
                .post('/api/diarios')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update diarios', async () => {
        const updatedEntity: DiarioDTO = (
            await request(app.getHttpServer())
                .put('/api/diarios')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update diarios from id', async () => {
        const updatedEntity: DiarioDTO = (
            await request(app.getHttpServer())
                .put('/api/diarios/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE diarios', async () => {
        const deletedEntity: DiarioDTO = (
            await request(app.getHttpServer())
                .delete('/api/diarios/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
