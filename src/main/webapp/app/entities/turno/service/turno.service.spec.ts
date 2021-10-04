import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { TurnoEstado } from 'app/entities/enumerations/turno-estado.model';
import { ITurno, Turno } from '../turno.model';

import { TurnoService } from './turno.service';

describe('Service Tests', () => {
  describe('Turno Service', () => {
    let service: TurnoService;
    let httpMock: HttpTestingController;
    let elemDefault: ITurno;
    let expectedResult: ITurno | ITurno[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TurnoService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 'AAAAAAA',
        estado: TurnoEstado.APROBADO,
        fechaHora: currentDate,
        motivo: 'AAAAAAA',
        descripcion: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            fechaHora: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Turno', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
            fechaHora: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaHora: currentDate,
          },
          returnedFromService
        );

        service.create(new Turno()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Turno', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            estado: 'BBBBBB',
            fechaHora: currentDate.format(DATE_TIME_FORMAT),
            motivo: 'BBBBBB',
            descripcion: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaHora: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Turno', () => {
        const patchObject = Object.assign(
          {
            fechaHora: currentDate.format(DATE_TIME_FORMAT),
            motivo: 'BBBBBB',
            descripcion: 'BBBBBB',
          },
          new Turno()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            fechaHora: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Turno', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            estado: 'BBBBBB',
            fechaHora: currentDate.format(DATE_TIME_FORMAT),
            motivo: 'BBBBBB',
            descripcion: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fechaHora: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Turno', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTurnoToCollectionIfMissing', () => {
        it('should add a Turno to an empty array', () => {
          const turno: ITurno = { id: 'ABC' };
          expectedResult = service.addTurnoToCollectionIfMissing([], turno);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(turno);
        });

        it('should not add a Turno to an array that contains it', () => {
          const turno: ITurno = { id: 'ABC' };
          const turnoCollection: ITurno[] = [
            {
              ...turno,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addTurnoToCollectionIfMissing(turnoCollection, turno);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Turno to an array that doesn't contain it", () => {
          const turno: ITurno = { id: 'ABC' };
          const turnoCollection: ITurno[] = [{ id: 'CBA' }];
          expectedResult = service.addTurnoToCollectionIfMissing(turnoCollection, turno);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(turno);
        });

        it('should add only unique Turno to an array', () => {
          const turnoArray: ITurno[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Home Relacciones' }];
          const turnoCollection: ITurno[] = [{ id: 'ABC' }];
          expectedResult = service.addTurnoToCollectionIfMissing(turnoCollection, ...turnoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const turno: ITurno = { id: 'ABC' };
          const turno2: ITurno = { id: 'CBA' };
          expectedResult = service.addTurnoToCollectionIfMissing([], turno, turno2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(turno);
          expect(expectedResult).toContain(turno2);
        });

        it('should accept null and undefined values', () => {
          const turno: ITurno = { id: 'ABC' };
          expectedResult = service.addTurnoToCollectionIfMissing([], null, turno, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(turno);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
