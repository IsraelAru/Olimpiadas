import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITurno, getTurnoIdentifier } from '../turno.model';

export type EntityResponseType = HttpResponse<ITurno>;
export type EntityArrayResponseType = HttpResponse<ITurno[]>;

@Injectable({ providedIn: 'root' })
export class TurnoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/turnos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(turno: ITurno): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(turno);
    return this.http
      .post<ITurno>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(turno: ITurno): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(turno);
    return this.http
      .put<ITurno>(`${this.resourceUrl}/${getTurnoIdentifier(turno) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(turno: ITurno): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(turno);
    return this.http
      .patch<ITurno>(`${this.resourceUrl}/${getTurnoIdentifier(turno) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<ITurno>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITurno[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTurnoToCollectionIfMissing(turnoCollection: ITurno[], ...turnosToCheck: (ITurno | null | undefined)[]): ITurno[] {
    const turnos: ITurno[] = turnosToCheck.filter(isPresent);
    if (turnos.length > 0) {
      const turnoCollectionIdentifiers = turnoCollection.map(turnoItem => getTurnoIdentifier(turnoItem)!);
      const turnosToAdd = turnos.filter(turnoItem => {
        const turnoIdentifier = getTurnoIdentifier(turnoItem);
        if (turnoIdentifier == null || turnoCollectionIdentifiers.includes(turnoIdentifier)) {
          return false;
        }
        turnoCollectionIdentifiers.push(turnoIdentifier);
        return true;
      });
      return [...turnosToAdd, ...turnoCollection];
    }
    return turnoCollection;
  }

  protected convertDateFromClient(turno: ITurno): ITurno {
    return Object.assign({}, turno, {
      fechaHora: turno.fechaHora?.isValid() ? turno.fechaHora.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fechaHora = res.body.fechaHora ? dayjs(res.body.fechaHora) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((turno: ITurno) => {
        turno.fechaHora = turno.fechaHora ? dayjs(turno.fechaHora) : undefined;
      });
    }
    return res;
  }
}
