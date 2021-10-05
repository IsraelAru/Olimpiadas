import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPaciente, Paciente } from '../paciente.model';

import { PacienteService } from './paciente.service';

describe('Service Tests', () => {
  describe('Paciente Service', () => {
    let service: PacienteService;
    let httpMock: HttpTestingController;
    let elemDefault: IPaciente;
    let expectedResult: IPaciente | IPaciente[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PacienteService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        dni: 0,
        nombre: 'AAAAAAA',
        apellido: 'AAAAAAA',
        telefono: 0,
        historiaClinica: 'AAAAAAA',
        mail: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Paciente', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Paciente()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Paciente', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            dni: 1,
            nombre: 'BBBBBB',
            apellido: 'BBBBBB',
            telefono: 1,
            historiaClinica: 'BBBBBB',
            mail: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Paciente', () => {
        const patchObject = Object.assign(
          {
            nombre: 'BBBBBB',
            apellido: 'BBBBBB',
          },
          new Paciente()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Paciente', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            dni: 1,
            nombre: 'BBBBBB',
            apellido: 'BBBBBB',
            telefono: 1,
            historiaClinica: 'BBBBBB',
            mail: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Paciente', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPacienteToCollectionIfMissing', () => {
        it('should add a Paciente to an empty array', () => {
          const paciente: IPaciente = { id: 'ABC' };
          expectedResult = service.addPacienteToCollectionIfMissing([], paciente);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(paciente);
        });

        it('should not add a Paciente to an array that contains it', () => {
          const paciente: IPaciente = { id: 'ABC' };
          const pacienteCollection: IPaciente[] = [
            {
              ...paciente,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addPacienteToCollectionIfMissing(pacienteCollection, paciente);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Paciente to an array that doesn't contain it", () => {
          const paciente: IPaciente = { id: 'ABC' };
          const pacienteCollection: IPaciente[] = [{ id: 'CBA' }];
          expectedResult = service.addPacienteToCollectionIfMissing(pacienteCollection, paciente);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(paciente);
        });

        it('should add only unique Paciente to an array', () => {
          const pacienteArray: IPaciente[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Afghani Plástico' }];
          const pacienteCollection: IPaciente[] = [{ id: 'ABC' }];
          expectedResult = service.addPacienteToCollectionIfMissing(pacienteCollection, ...pacienteArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const paciente: IPaciente = { id: 'ABC' };
          const paciente2: IPaciente = { id: 'CBA' };
          expectedResult = service.addPacienteToCollectionIfMissing([], paciente, paciente2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(paciente);
          expect(expectedResult).toContain(paciente2);
        });

        it('should accept null and undefined values', () => {
          const paciente: IPaciente = { id: 'ABC' };
          expectedResult = service.addPacienteToCollectionIfMissing([], null, paciente, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(paciente);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
