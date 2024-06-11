import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConference } from '../conference.model';
import { ConferenceService } from '../service/conference.service';

const conferenceResolve = (route: ActivatedRouteSnapshot): Observable<null | IConference> => {
  const id = route.params['id'];
  if (id) {
    return inject(ConferenceService)
      .find(id)
      .pipe(
        mergeMap((conference: HttpResponse<IConference>) => {
          if (conference.body) {
            return of(conference.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default conferenceResolve;
