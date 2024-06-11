import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISpeaker } from '../speaker.model';
import { SpeakerService } from '../service/speaker.service';

const speakerResolve = (route: ActivatedRouteSnapshot): Observable<null | ISpeaker> => {
  const id = route.params['id'];
  if (id) {
    return inject(SpeakerService)
      .find(id)
      .pipe(
        mergeMap((speaker: HttpResponse<ISpeaker>) => {
          if (speaker.body) {
            return of(speaker.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default speakerResolve;
