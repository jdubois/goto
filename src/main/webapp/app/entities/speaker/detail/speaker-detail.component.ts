import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ISpeaker } from '../speaker.model';

@Component({
  standalone: true,
  selector: 'jhi-speaker-detail',
  templateUrl: './speaker-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class SpeakerDetailComponent {
  speaker = input<ISpeaker | null>(null);

  previousState(): void {
    window.history.back();
  }
}
