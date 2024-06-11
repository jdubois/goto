import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISession, NewSession } from '../session.model';

export type PartialUpdateSession = Partial<ISession> & Pick<ISession, 'id'>;

export type EntityResponseType = HttpResponse<ISession>;
export type EntityArrayResponseType = HttpResponse<ISession[]>;

@Injectable({ providedIn: 'root' })
export class SessionService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sessions');

  create(session: NewSession): Observable<EntityResponseType> {
    return this.http.post<ISession>(this.resourceUrl, session, { observe: 'response' });
  }

  update(session: ISession): Observable<EntityResponseType> {
    return this.http.put<ISession>(`${this.resourceUrl}/${this.getSessionIdentifier(session)}`, session, { observe: 'response' });
  }

  partialUpdate(session: PartialUpdateSession): Observable<EntityResponseType> {
    return this.http.patch<ISession>(`${this.resourceUrl}/${this.getSessionIdentifier(session)}`, session, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISession>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISession[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSessionIdentifier(session: Pick<ISession, 'id'>): number {
    return session.id;
  }

  compareSession(o1: Pick<ISession, 'id'> | null, o2: Pick<ISession, 'id'> | null): boolean {
    return o1 && o2 ? this.getSessionIdentifier(o1) === this.getSessionIdentifier(o2) : o1 === o2;
  }

  addSessionToCollectionIfMissing<Type extends Pick<ISession, 'id'>>(
    sessionCollection: Type[],
    ...sessionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sessions: Type[] = sessionsToCheck.filter(isPresent);
    if (sessions.length > 0) {
      const sessionCollectionIdentifiers = sessionCollection.map(sessionItem => this.getSessionIdentifier(sessionItem));
      const sessionsToAdd = sessions.filter(sessionItem => {
        const sessionIdentifier = this.getSessionIdentifier(sessionItem);
        if (sessionCollectionIdentifiers.includes(sessionIdentifier)) {
          return false;
        }
        sessionCollectionIdentifiers.push(sessionIdentifier);
        return true;
      });
      return [...sessionsToAdd, ...sessionCollection];
    }
    return sessionCollection;
  }
}
