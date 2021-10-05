import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDiario, getDiarioIdentifier } from '../diario.model';

export type EntityResponseType = HttpResponse<IDiario>;
export type EntityArrayResponseType = HttpResponse<IDiario[]>;

@Injectable({ providedIn: 'root' })
export class DiarioService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/diarios');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(diario: IDiario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(diario);
    return this.http
      .post<IDiario>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(diario: IDiario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(diario);
    return this.http
      .put<IDiario>(`${this.resourceUrl}/${getDiarioIdentifier(diario) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(diario: IDiario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(diario);
    return this.http
      .patch<IDiario>(`${this.resourceUrl}/${getDiarioIdentifier(diario) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IDiario>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDiario[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDiarioToCollectionIfMissing(diarioCollection: IDiario[], ...diariosToCheck: (IDiario | null | undefined)[]): IDiario[] {
    const diarios: IDiario[] = diariosToCheck.filter(isPresent);
    if (diarios.length > 0) {
      const diarioCollectionIdentifiers = diarioCollection.map(diarioItem => getDiarioIdentifier(diarioItem)!);
      const diariosToAdd = diarios.filter(diarioItem => {
        const diarioIdentifier = getDiarioIdentifier(diarioItem);
        if (diarioIdentifier == null || diarioCollectionIdentifiers.includes(diarioIdentifier)) {
          return false;
        }
        diarioCollectionIdentifiers.push(diarioIdentifier);
        return true;
      });
      return [...diariosToAdd, ...diarioCollection];
    }
    return diarioCollection;
  }

  protected convertDateFromClient(diario: IDiario): IDiario {
    return Object.assign({}, diario, {
      fecha: diario.fecha?.isValid() ? diario.fecha.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fecha = res.body.fecha ? dayjs(res.body.fecha) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((diario: IDiario) => {
        diario.fecha = diario.fecha ? dayjs(diario.fecha) : undefined;
      });
    }
    return res;
  }
}
