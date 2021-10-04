import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDiario, Diario } from '../diario.model';

import { DiarioService } from './diario.service';

describe('Service Tests', () => {
  describe('Diario Service', () => {
    let service: DiarioService;
    let httpMock: HttpTestingController;
    let elemDefault: IDiario;
    let expectedResult: IDiario | IDiario[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(DiarioService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 'AAAAAAA',
        entrada: 'AAAAAAA',
        fecha: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            fecha: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Diario', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
            fecha: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fecha: currentDate,
          },
          returnedFromService
        );

        service.create(new Diario()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Diario', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            entrada: 'BBBBBB',
            fecha: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fecha: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Diario', () => {
        const patchObject = Object.assign(
          {
            entrada: 'BBBBBB',
            fecha: currentDate.format(DATE_TIME_FORMAT),
          },
          new Diario()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            fecha: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Diario', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            entrada: 'BBBBBB',
            fecha: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            fecha: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Diario', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addDiarioToCollectionIfMissing', () => {
        it('should add a Diario to an empty array', () => {
          const diario: IDiario = { id: 'ABC' };
          expectedResult = service.addDiarioToCollectionIfMissing([], diario);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(diario);
        });

        it('should not add a Diario to an array that contains it', () => {
          const diario: IDiario = { id: 'ABC' };
          const diarioCollection: IDiario[] = [
            {
              ...diario,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addDiarioToCollectionIfMissing(diarioCollection, diario);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Diario to an array that doesn't contain it", () => {
          const diario: IDiario = { id: 'ABC' };
          const diarioCollection: IDiario[] = [{ id: 'CBA' }];
          expectedResult = service.addDiarioToCollectionIfMissing(diarioCollection, diario);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(diario);
        });

        it('should add only unique Diario to an array', () => {
          const diarioArray: IDiario[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Estados móbil streamline' }];
          const diarioCollection: IDiario[] = [{ id: 'ABC' }];
          expectedResult = service.addDiarioToCollectionIfMissing(diarioCollection, ...diarioArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const diario: IDiario = { id: 'ABC' };
          const diario2: IDiario = { id: 'CBA' };
          expectedResult = service.addDiarioToCollectionIfMissing([], diario, diario2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(diario);
          expect(expectedResult).toContain(diario2);
        });

        it('should accept null and undefined values', () => {
          const diario: IDiario = { id: 'ABC' };
          expectedResult = service.addDiarioToCollectionIfMissing([], null, diario, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(diario);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
