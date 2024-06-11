import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISession } from '../session.model';
import { SessionService } from '../service/session.service';

@Component({
  standalone: true,
  templateUrl: './session-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SessionDeleteDialogComponent {
  session?: ISession;

  protected sessionService = inject(SessionService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sessionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
