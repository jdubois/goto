import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { SessionComponent } from './list/session.component';
import { SessionDetailComponent } from './detail/session-detail.component';
import { SessionUpdateComponent } from './update/session-update.component';
import SessionResolve from './route/session-routing-resolve.service';

const sessionRoute: Routes = [
  {
    path: '',
    component: SessionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SessionDetailComponent,
    resolve: {
      session: SessionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SessionUpdateComponent,
    resolve: {
      session: SessionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SessionUpdateComponent,
    resolve: {
      session: SessionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default sessionRoute;
