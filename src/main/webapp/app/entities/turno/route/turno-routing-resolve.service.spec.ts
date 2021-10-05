jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITurno, Turno } from '../turno.model';
import { TurnoService } from '../service/turno.service';

import { TurnoRoutingResolveService } from './turno-routing-resolve.service';

describe('Service Tests', () => {
  describe('Turno routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TurnoRoutingResolveService;
    let service: TurnoService;
    let resultTurno: ITurno | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TurnoRoutingResolveService);
      service = TestBed.inject(TurnoService);
      resultTurno = undefined;
    });

    describe('resolve', () => {
      it('should return ITurno returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTurno = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultTurno).toEqual({ id: 'ABC' });
      });

      it('should return new ITurno if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTurno = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTurno).toEqual(new Turno());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTurno = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultTurno).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
