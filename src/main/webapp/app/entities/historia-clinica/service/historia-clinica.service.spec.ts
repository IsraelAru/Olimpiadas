import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Categoria } from 'app/entities/enumerations/categoria.model';
import { IHistoriaClinica, HistoriaClinica } from '../historia-clinica.model';

import { HistoriaClinicaService } from './historia-clinica.service';

describe('Service Tests', () => {
  describe('HistoriaClinica Service', () => {
    let service: HistoriaClinicaService;
    let httpMock: HttpTestingController;
    let elemDefault: IHistoriaClinica;
    let expectedResult: IHistoriaClinica | IHistoriaClinica[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(HistoriaClinicaService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 'AAAAAAA',
        diagnostico: 'AAAAAAA',
        tratamiento: 'AAAAAAA',
        categoria: Categoria.EMERGENCIA,
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

      it('should create a HistoriaClinica', () => {
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

        service.create(new HistoriaClinica()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a HistoriaClinica', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            diagnostico: 'BBBBBB',
            tratamiento: 'BBBBBB',
            categoria: 'BBBBBB',
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

      it('should partial update a HistoriaClinica', () => {
        const patchObject = Object.assign(
          {
            diagnostico: 'BBBBBB',
            tratamiento: 'BBBBBB',
            categoria: 'BBBBBB',
          },
          new HistoriaClinica()
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

      it('should return a list of HistoriaClinica', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            diagnostico: 'BBBBBB',
            tratamiento: 'BBBBBB',
            categoria: 'BBBBBB',
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

      it('should delete a HistoriaClinica', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addHistoriaClinicaToCollectionIfMissing', () => {
        it('should add a HistoriaClinica to an empty array', () => {
          const historiaClinica: IHistoriaClinica = { id: 'ABC' };
          expectedResult = service.addHistoriaClinicaToCollectionIfMissing([], historiaClinica);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(historiaClinica);
        });

        it('should not add a HistoriaClinica to an array that contains it', () => {
          const historiaClinica: IHistoriaClinica = { id: 'ABC' };
          const historiaClinicaCollection: IHistoriaClinica[] = [
            {
              ...historiaClinica,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addHistoriaClinicaToCollectionIfMissing(historiaClinicaCollection, historiaClinica);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a HistoriaClinica to an array that doesn't contain it", () => {
          const historiaClinica: IHistoriaClinica = { id: 'ABC' };
          const historiaClinicaCollection: IHistoriaClinica[] = [{ id: 'CBA' }];
          expectedResult = service.addHistoriaClinicaToCollectionIfMissing(historiaClinicaCollection, historiaClinica);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(historiaClinica);
        });

        it('should add only unique HistoriaClinica to an array', () => {
          const historiaClinicaArray: IHistoriaClinica[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Acero' }];
          const historiaClinicaCollection: IHistoriaClinica[] = [{ id: 'ABC' }];
          expectedResult = service.addHistoriaClinicaToCollectionIfMissing(historiaClinicaCollection, ...historiaClinicaArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const historiaClinica: IHistoriaClinica = { id: 'ABC' };
          const historiaClinica2: IHistoriaClinica = { id: 'CBA' };
          expectedResult = service.addHistoriaClinicaToCollectionIfMissing([], historiaClinica, historiaClinica2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(historiaClinica);
          expect(expectedResult).toContain(historiaClinica2);
        });

        it('should accept null and undefined values', () => {
          const historiaClinica: IHistoriaClinica = { id: 'ABC' };
          expectedResult = service.addHistoriaClinicaToCollectionIfMissing([], null, historiaClinica, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(historiaClinica);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
