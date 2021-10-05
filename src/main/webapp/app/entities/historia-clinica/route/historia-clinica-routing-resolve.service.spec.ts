jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IHistoriaClinica, HistoriaClinica } from '../historia-clinica.model';
import { HistoriaClinicaService } from '../service/historia-clinica.service';

import { HistoriaClinicaRoutingResolveService } from './historia-clinica-routing-resolve.service';

describe('Service Tests', () => {
  describe('HistoriaClinica routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: HistoriaClinicaRoutingResolveService;
    let service: HistoriaClinicaService;
    let resultHistoriaClinica: IHistoriaClinica | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(HistoriaClinicaRoutingResolveService);
      service = TestBed.inject(HistoriaClinicaService);
      resultHistoriaClinica = undefined;
    });

    describe('resolve', () => {
      it('should return IHistoriaClinica returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultHistoriaClinica = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultHistoriaClinica).toEqual({ id: 'ABC' });
      });

      it('should return new IHistoriaClinica if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultHistoriaClinica = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultHistoriaClinica).toEqual(new HistoriaClinica());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultHistoriaClinica = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultHistoriaClinica).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
