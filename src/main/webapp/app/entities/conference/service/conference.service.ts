import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConference, NewConference } from '../conference.model';

export type PartialUpdateConference = Partial<IConference> & Pick<IConference, 'id'>;

type RestOf<T extends IConference | NewConference> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestConference = RestOf<IConference>;

export type NewRestConference = RestOf<NewConference>;

export type PartialUpdateRestConference = RestOf<PartialUpdateConference>;

export type EntityResponseType = HttpResponse<IConference>;
export type EntityArrayResponseType = HttpResponse<IConference[]>;

@Injectable({ providedIn: 'root' })
export class ConferenceService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/conferences');

  create(conference: NewConference): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(conference);
    return this.http
      .post<RestConference>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(conference: IConference): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(conference);
    return this.http
      .put<RestConference>(`${this.resourceUrl}/${this.getConferenceIdentifier(conference)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(conference: PartialUpdateConference): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(conference);
    return this.http
      .patch<RestConference>(`${this.resourceUrl}/${this.getConferenceIdentifier(conference)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestConference>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestConference[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getConferenceIdentifier(conference: Pick<IConference, 'id'>): number {
    return conference.id;
  }

  compareConference(o1: Pick<IConference, 'id'> | null, o2: Pick<IConference, 'id'> | null): boolean {
    return o1 && o2 ? this.getConferenceIdentifier(o1) === this.getConferenceIdentifier(o2) : o1 === o2;
  }

  addConferenceToCollectionIfMissing<Type extends Pick<IConference, 'id'>>(
    conferenceCollection: Type[],
    ...conferencesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const conferences: Type[] = conferencesToCheck.filter(isPresent);
    if (conferences.length > 0) {
      const conferenceCollectionIdentifiers = conferenceCollection.map(conferenceItem => this.getConferenceIdentifier(conferenceItem));
      const conferencesToAdd = conferences.filter(conferenceItem => {
        const conferenceIdentifier = this.getConferenceIdentifier(conferenceItem);
        if (conferenceCollectionIdentifiers.includes(conferenceIdentifier)) {
          return false;
        }
        conferenceCollectionIdentifiers.push(conferenceIdentifier);
        return true;
      });
      return [...conferencesToAdd, ...conferenceCollection];
    }
    return conferenceCollection;
  }

  protected convertDateFromClient<T extends IConference | NewConference | PartialUpdateConference>(conference: T): RestOf<T> {
    return {
      ...conference,
      date: conference.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restConference: RestConference): IConference {
    return {
      ...restConference,
      date: restConference.date ? dayjs(restConference.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestConference>): HttpResponse<IConference> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestConference[]>): HttpResponse<IConference[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
