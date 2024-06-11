import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ConferenceComponent } from './list/conference.component';
import { ConferenceDetailComponent } from './detail/conference-detail.component';
import { ConferenceUpdateComponent } from './update/conference-update.component';
import ConferenceResolve from './route/conference-routing-resolve.service';

const conferenceRoute: Routes = [
  {
    path: '',
    component: ConferenceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConferenceDetailComponent,
    resolve: {
      conference: ConferenceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConferenceUpdateComponent,
    resolve: {
      conference: ConferenceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConferenceUpdateComponent,
    resolve: {
      conference: ConferenceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default conferenceRoute;
