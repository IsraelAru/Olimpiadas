import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDiario, Diario } from '../diario.model';
import { DiarioService } from '../service/diario.service';

@Injectable({ providedIn: 'root' })
export class DiarioRoutingResolveService implements Resolve<IDiario> {
  constructor(protected service: DiarioService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDiario> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((diario: HttpResponse<Diario>) => {
          if (diario.body) {
            return of(diario.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Diario());
  }
}
