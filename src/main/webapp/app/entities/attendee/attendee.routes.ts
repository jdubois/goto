import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AttendeeComponent } from './list/attendee.component';
import { AttendeeDetailComponent } from './detail/attendee-detail.component';
import { AttendeeUpdateComponent } from './update/attendee-update.component';
import AttendeeResolve from './route/attendee-routing-resolve.service';

const attendeeRoute: Routes = [
  {
    path: '',
    component: AttendeeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AttendeeDetailComponent,
    resolve: {
      attendee: AttendeeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AttendeeUpdateComponent,
    resolve: {
      attendee: AttendeeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AttendeeUpdateComponent,
    resolve: {
      attendee: AttendeeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default attendeeRoute;
