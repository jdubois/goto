import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISpeaker, NewSpeaker } from '../speaker.model';

export type PartialUpdateSpeaker = Partial<ISpeaker> & Pick<ISpeaker, 'id'>;

export type EntityResponseType = HttpResponse<ISpeaker>;
export type EntityArrayResponseType = HttpResponse<ISpeaker[]>;

@Injectable({ providedIn: 'root' })
export class SpeakerService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/speakers');

  create(speaker: NewSpeaker): Observable<EntityResponseType> {
    return this.http.post<ISpeaker>(this.resourceUrl, speaker, { observe: 'response' });
  }

  update(speaker: ISpeaker): Observable<EntityResponseType> {
    return this.http.put<ISpeaker>(`${this.resourceUrl}/${this.getSpeakerIdentifier(speaker)}`, speaker, { observe: 'response' });
  }

  partialUpdate(speaker: PartialUpdateSpeaker): Observable<EntityResponseType> {
    return this.http.patch<ISpeaker>(`${this.resourceUrl}/${this.getSpeakerIdentifier(speaker)}`, speaker, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISpeaker>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISpeaker[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSpeakerIdentifier(speaker: Pick<ISpeaker, 'id'>): number {
    return speaker.id;
  }

  compareSpeaker(o1: Pick<ISpeaker, 'id'> | null, o2: Pick<ISpeaker, 'id'> | null): boolean {
    return o1 && o2 ? this.getSpeakerIdentifier(o1) === this.getSpeakerIdentifier(o2) : o1 === o2;
  }

  addSpeakerToCollectionIfMissing<Type extends Pick<ISpeaker, 'id'>>(
    speakerCollection: Type[],
    ...speakersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const speakers: Type[] = speakersToCheck.filter(isPresent);
    if (speakers.length > 0) {
      const speakerCollectionIdentifiers = speakerCollection.map(speakerItem => this.getSpeakerIdentifier(speakerItem));
      const speakersToAdd = speakers.filter(speakerItem => {
        const speakerIdentifier = this.getSpeakerIdentifier(speakerItem);
        if (speakerCollectionIdentifiers.includes(speakerIdentifier)) {
          return false;
        }
        speakerCollectionIdentifiers.push(speakerIdentifier);
        return true;
      });
      return [...speakersToAdd, ...speakerCollection];
    }
    return speakerCollection;
  }
}
