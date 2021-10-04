import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITurno, Turno } from '../turno.model';
import { TurnoService } from '../service/turno.service';

@Injectable({ providedIn: 'root' })
export class TurnoRoutingResolveService implements Resolve<ITurno> {
  constructor(protected service: TurnoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITurno> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((turno: HttpResponse<Turno>) => {
          if (turno.body) {
            return of(turno.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Turno());
  }
}
