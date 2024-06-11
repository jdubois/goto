import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IConference } from '../conference.model';
import { ConferenceService } from '../service/conference.service';

@Component({
  standalone: true,
  templateUrl: './conference-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ConferenceDeleteDialogComponent {
  conference?: IConference;

  protected conferenceService = inject(ConferenceService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.conferenceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
