import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHistoriaClinica, getHistoriaClinicaIdentifier } from '../historia-clinica.model';

export type EntityResponseType = HttpResponse<IHistoriaClinica>;
export type EntityArrayResponseType = HttpResponse<IHistoriaClinica[]>;

@Injectable({ providedIn: 'root' })
export class HistoriaClinicaService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/historia-clinicas');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(historiaClinica: IHistoriaClinica): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historiaClinica);
    return this.http
      .post<IHistoriaClinica>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(historiaClinica: IHistoriaClinica): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historiaClinica);
    return this.http
      .put<IHistoriaClinica>(`${this.resourceUrl}/${getHistoriaClinicaIdentifier(historiaClinica) as string}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(historiaClinica: IHistoriaClinica): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(historiaClinica);
    return this.http
      .patch<IHistoriaClinica>(`${this.resourceUrl}/${getHistoriaClinicaIdentifier(historiaClinica) as string}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IHistoriaClinica>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IHistoriaClinica[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addHistoriaClinicaToCollectionIfMissing(
    historiaClinicaCollection: IHistoriaClinica[],
    ...historiaClinicasToCheck: (IHistoriaClinica | null | undefined)[]
  ): IHistoriaClinica[] {
    const historiaClinicas: IHistoriaClinica[] = historiaClinicasToCheck.filter(isPresent);
    if (historiaClinicas.length > 0) {
      const historiaClinicaCollectionIdentifiers = historiaClinicaCollection.map(
        historiaClinicaItem => getHistoriaClinicaIdentifier(historiaClinicaItem)!
      );
      const historiaClinicasToAdd = historiaClinicas.filter(historiaClinicaItem => {
        const historiaClinicaIdentifier = getHistoriaClinicaIdentifier(historiaClinicaItem);
        if (historiaClinicaIdentifier == null || historiaClinicaCollectionIdentifiers.includes(historiaClinicaIdentifier)) {
          return false;
        }
        historiaClinicaCollectionIdentifiers.push(historiaClinicaIdentifier);
        return true;
      });
      return [...historiaClinicasToAdd, ...historiaClinicaCollection];
    }
    return historiaClinicaCollection;
  }

  protected convertDateFromClient(historiaClinica: IHistoriaClinica): IHistoriaClinica {
    return Object.assign({}, historiaClinica, {
      fecha: historiaClinica.fecha?.isValid() ? historiaClinica.fecha.toJSON() : undefined,
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
      res.body.forEach((historiaClinica: IHistoriaClinica) => {
        historiaClinica.fecha = historiaClinica.fecha ? dayjs(historiaClinica.fecha) : undefined;
      });
    }
    return res;
  }
}
