import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISession } from 'app/entities/session/session.model';
import { SessionService } from 'app/entities/session/service/session.service';
import { IAttendee } from '../attendee.model';
import { AttendeeService } from '../service/attendee.service';
import { AttendeeFormService, AttendeeFormGroup } from './attendee-form.service';

@Component({
  standalone: true,
  selector: 'jhi-attendee-update',
  templateUrl: './attendee-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AttendeeUpdateComponent implements OnInit {
  isSaving = false;
  attendee: IAttendee | null = null;

  sessionsSharedCollection: ISession[] = [];

  protected attendeeService = inject(AttendeeService);
  protected attendeeFormService = inject(AttendeeFormService);
  protected sessionService = inject(SessionService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AttendeeFormGroup = this.attendeeFormService.createAttendeeFormGroup();

  compareSession = (o1: ISession | null, o2: ISession | null): boolean => this.sessionService.compareSession(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ attendee }) => {
      this.attendee = attendee;
      if (attendee) {
        this.updateForm(attendee);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const attendee = this.attendeeFormService.getAttendee(this.editForm);
    if (attendee.id !== null) {
      this.subscribeToSaveResponse(this.attendeeService.update(attendee));
    } else {
      this.subscribeToSaveResponse(this.attendeeService.create(attendee));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAttendee>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(attendee: IAttendee): void {
    this.attendee = attendee;
    this.attendeeFormService.resetForm(this.editForm, attendee);

    this.sessionsSharedCollection = this.sessionService.addSessionToCollectionIfMissing<ISession>(
      this.sessionsSharedCollection,
      ...(attendee.sessions ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.sessionService
      .query()
      .pipe(map((res: HttpResponse<ISession[]>) => res.body ?? []))
      .pipe(
        map((sessions: ISession[]) =>
          this.sessionService.addSessionToCollectionIfMissing<ISession>(sessions, ...(this.attendee?.sessions ?? [])),
        ),
      )
      .subscribe((sessions: ISession[]) => (this.sessionsSharedCollection = sessions));
  }
}
