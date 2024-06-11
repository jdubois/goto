import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IConference } from '../conference.model';

@Component({
  standalone: true,
  selector: 'jhi-conference-detail',
  templateUrl: './conference-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ConferenceDetailComponent {
  conference = input<IConference | null>(null);

  previousState(): void {
    window.history.back();
  }
}
