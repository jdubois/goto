import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ISession } from '../session.model';

@Component({
  standalone: true,
  selector: 'jhi-session-detail',
  templateUrl: './session-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class SessionDetailComponent {
  session = input<ISession | null>(null);

  previousState(): void {
    window.history.back();
  }
}
