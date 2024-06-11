import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'gotoApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'conference',
    data: { pageTitle: 'gotoApp.conference.home.title' },
    loadChildren: () => import('./conference/conference.routes'),
  },
  {
    path: 'speaker',
    data: { pageTitle: 'gotoApp.speaker.home.title' },
    loadChildren: () => import('./speaker/speaker.routes'),
  },
  {
    path: 'attendee',
    data: { pageTitle: 'gotoApp.attendee.home.title' },
    loadChildren: () => import('./attendee/attendee.routes'),
  },
  {
    path: 'session',
    data: { pageTitle: 'gotoApp.session.home.title' },
    loadChildren: () => import('./session/session.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
