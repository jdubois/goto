import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAttendee, NewAttendee } from '../attendee.model';

export type PartialUpdateAttendee = Partial<IAttendee> & Pick<IAttendee, 'id'>;

export type EntityResponseType = HttpResponse<IAttendee>;
export type EntityArrayResponseType = HttpResponse<IAttendee[]>;

@Injectable({ providedIn: 'root' })
export class AttendeeService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/attendees');

  create(attendee: NewAttendee): Observable<EntityResponseType> {
    return this.http.post<IAttendee>(this.resourceUrl, attendee, { observe: 'response' });
  }

  update(attendee: IAttendee): Observable<EntityResponseType> {
    return this.http.put<IAttendee>(`${this.resourceUrl}/${this.getAttendeeIdentifier(attendee)}`, attendee, { observe: 'response' });
  }

  partialUpdate(attendee: PartialUpdateAttendee): Observable<EntityResponseType> {
    return this.http.patch<IAttendee>(`${this.resourceUrl}/${this.getAttendeeIdentifier(attendee)}`, attendee, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAttendee>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAttendee[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAttendeeIdentifier(attendee: Pick<IAttendee, 'id'>): number {
    return attendee.id;
  }

  compareAttendee(o1: Pick<IAttendee, 'id'> | null, o2: Pick<IAttendee, 'id'> | null): boolean {
    return o1 && o2 ? this.getAttendeeIdentifier(o1) === this.getAttendeeIdentifier(o2) : o1 === o2;
  }

  addAttendeeToCollectionIfMissing<Type extends Pick<IAttendee, 'id'>>(
    attendeeCollection: Type[],
    ...attendeesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const attendees: Type[] = attendeesToCheck.filter(isPresent);
    if (attendees.length > 0) {
      const attendeeCollectionIdentifiers = attendeeCollection.map(attendeeItem => this.getAttendeeIdentifier(attendeeItem));
      const attendeesToAdd = attendees.filter(attendeeItem => {
        const attendeeIdentifier = this.getAttendeeIdentifier(attendeeItem);
        if (attendeeCollectionIdentifiers.includes(attendeeIdentifier)) {
          return false;
        }
        attendeeCollectionIdentifiers.push(attendeeIdentifier);
        return true;
      });
      return [...attendeesToAdd, ...attendeeCollection];
    }
    return attendeeCollection;
  }
}
