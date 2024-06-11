import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { SpeakerComponent } from './list/speaker.component';
import { SpeakerDetailComponent } from './detail/speaker-detail.component';
import { SpeakerUpdateComponent } from './update/speaker-update.component';
import SpeakerResolve from './route/speaker-routing-resolve.service';

const speakerRoute: Routes = [
  {
    path: '',
    component: SpeakerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SpeakerDetailComponent,
    resolve: {
      speaker: SpeakerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SpeakerUpdateComponent,
    resolve: {
      speaker: SpeakerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SpeakerUpdateComponent,
    resolve: {
      speaker: SpeakerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default speakerRoute;
