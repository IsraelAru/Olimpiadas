jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IDiario, Diario } from '../diario.model';
import { DiarioService } from '../service/diario.service';

import { DiarioRoutingResolveService } from './diario-routing-resolve.service';

describe('Service Tests', () => {
  describe('Diario routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: DiarioRoutingResolveService;
    let service: DiarioService;
    let resultDiario: IDiario | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(DiarioRoutingResolveService);
      service = TestBed.inject(DiarioService);
      resultDiario = undefined;
    });

    describe('resolve', () => {
      it('should return IDiario returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDiario = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultDiario).toEqual({ id: 'ABC' });
      });

      it('should return new IDiario if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDiario = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultDiario).toEqual(new Diario());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultDiario = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultDiario).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});