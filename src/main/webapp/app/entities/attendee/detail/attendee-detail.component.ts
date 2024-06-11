import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IAttendee } from '../attendee.model';

@Component({
  standalone: true,
  selector: 'jhi-attendee-detail',
  templateUrl: './attendee-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class AttendeeDetailComponent {
  attendee = input<IAttendee | null>(null);

  previousState(): void {
    window.history.back();
  }
}
