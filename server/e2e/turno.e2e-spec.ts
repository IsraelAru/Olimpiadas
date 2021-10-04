import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { TurnoDTO } from '../src/service/dto/turno.dto';
import { TurnoService } from '../src/service/turno.service';

describe('Turno Controller', () => {
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
            .overrideProvider(TurnoService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all turnos ', async () => {
        const getEntities: TurnoDTO[] = (await request(app.getHttpServer()).get('/api/turnos').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET turnos by id', async () => {
        const getEntity: TurnoDTO = (
            await request(app.getHttpServer())
                .get('/api/turnos/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create turnos', async () => {
        const createdEntity: TurnoDTO = (
            await request(app.getHttpServer()).post('/api/turnos').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update turnos', async () => {
        const updatedEntity: TurnoDTO = (
            await request(app.getHttpServer()).put('/api/turnos').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update turnos from id', async () => {
        const updatedEntity: TurnoDTO = (
            await request(app.getHttpServer())
                .put('/api/turnos/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE turnos', async () => {
        const deletedEntity: TurnoDTO = (
            await request(app.getHttpServer())
                .delete('/api/turnos/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
