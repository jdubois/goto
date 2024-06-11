import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISpeaker } from 'app/entities/speaker/speaker.model';
import { SpeakerService } from 'app/entities/speaker/service/speaker.service';
import { IConference } from 'app/entities/conference/conference.model';
import { ConferenceService } from 'app/entities/conference/service/conference.service';
import { IAttendee } from 'app/entities/attendee/attendee.model';
import { AttendeeService } from 'app/entities/attendee/service/attendee.service';
import { SessionService } from '../service/session.service';
import { ISession } from '../session.model';
import { SessionFormService, SessionFormGroup } from './session-form.service';

@Component({
  standalone: true,
  selector: 'jhi-session-update',
  templateUrl: './session-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SessionUpdateComponent implements OnInit {
  isSaving = false;
  session: ISession | null = null;

  speakersSharedCollection: ISpeaker[] = [];
  conferencesSharedCollection: IConference[] = [];
  attendeesSharedCollection: IAttendee[] = [];

  protected sessionService = inject(SessionService);
  protected sessionFormService = inject(SessionFormService);
  protected speakerService = inject(SpeakerService);
  protected conferenceService = inject(ConferenceService);
  protected attendeeService = inject(AttendeeService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SessionFormGroup = this.sessionFormService.createSessionFormGroup();

  compareSpeaker = (o1: ISpeaker | null, o2: ISpeaker | null): boolean => this.speakerService.compareSpeaker(o1, o2);

  compareConference = (o1: IConference | null, o2: IConference | null): boolean => this.conferenceService.compareConference(o1, o2);

  compareAttendee = (o1: IAttendee | null, o2: IAttendee | null): boolean => this.attendeeService.compareAttendee(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ session }) => {
      this.session = session;
      if (session) {
        this.updateForm(session);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const session = this.sessionFormService.getSession(this.editForm);
    if (session.id !== null) {
      this.subscribeToSaveResponse(this.sessionService.update(session));
    } else {
      this.subscribeToSaveResponse(this.sessionService.create(session));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISession>>): void {
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

  protected updateForm(session: ISession): void {
    this.session = session;
    this.sessionFormService.resetForm(this.editForm, session);

    this.speakersSharedCollection = this.speakerService.addSpeakerToCollectionIfMissing<ISpeaker>(
      this.speakersSharedCollection,
      session.speaker,
    );
    this.conferencesSharedCollection = this.conferenceService.addConferenceToCollectionIfMissing<IConference>(
      this.conferencesSharedCollection,
      session.conference,
    );
    this.attendeesSharedCollection = this.attendeeService.addAttendeeToCollectionIfMissing<IAttendee>(
      this.attendeesSharedCollection,
      ...(session.attendees ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.speakerService
      .query()
      .pipe(map((res: HttpResponse<ISpeaker[]>) => res.body ?? []))
      .pipe(map((speakers: ISpeaker[]) => this.speakerService.addSpeakerToCollectionIfMissing<ISpeaker>(speakers, this.session?.speaker)))
      .subscribe((speakers: ISpeaker[]) => (this.speakersSharedCollection = speakers));

    this.conferenceService
      .query()
      .pipe(map((res: HttpResponse<IConference[]>) => res.body ?? []))
      .pipe(
        map((conferences: IConference[]) =>
          this.conferenceService.addConferenceToCollectionIfMissing<IConference>(conferences, this.session?.conference),
        ),
      )
      .subscribe((conferences: IConference[]) => (this.conferencesSharedCollection = conferences));

    this.attendeeService
      .query()
      .pipe(map((res: HttpResponse<IAttendee[]>) => res.body ?? []))
      .pipe(
        map((attendees: IAttendee[]) =>
          this.attendeeService.addAttendeeToCollectionIfMissing<IAttendee>(attendees, ...(this.session?.attendees ?? [])),
        ),
      )
      .subscribe((attendees: IAttendee[]) => (this.attendeesSharedCollection = attendees));
  }
}
