import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAttendee } from '../attendee.model';
import { AttendeeService } from '../service/attendee.service';

const attendeeResolve = (route: ActivatedRouteSnapshot): Observable<null | IAttendee> => {
  const id = route.params['id'];
  if (id) {
    return inject(AttendeeService)
      .find(id)
      .pipe(
        mergeMap((attendee: HttpResponse<IAttendee>) => {
          if (attendee.body) {
            return of(attendee.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default attendeeResolve;
