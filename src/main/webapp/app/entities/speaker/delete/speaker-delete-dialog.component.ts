import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISpeaker } from '../speaker.model';
import { SpeakerService } from '../service/speaker.service';

@Component({
  standalone: true,
  templateUrl: './speaker-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SpeakerDeleteDialogComponent {
  speaker?: ISpeaker;

  protected speakerService = inject(SpeakerService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.speakerService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
