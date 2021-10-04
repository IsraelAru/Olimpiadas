import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHistoriaClinica, HistoriaClinica } from '../historia-clinica.model';
import { HistoriaClinicaService } from '../service/historia-clinica.service';

@Injectable({ providedIn: 'root' })
export class HistoriaClinicaRoutingResolveService implements Resolve<IHistoriaClinica> {
  constructor(protected service: HistoriaClinicaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHistoriaClinica> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((historiaClinica: HttpResponse<HistoriaClinica>) => {
          if (historiaClinica.body) {
            return of(historiaClinica.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new HistoriaClinica());
  }
}
