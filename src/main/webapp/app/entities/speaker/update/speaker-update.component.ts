import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IConference } from 'app/entities/conference/conference.model';
import { ConferenceService } from 'app/entities/conference/service/conference.service';
import { ISpeaker } from '../speaker.model';
import { SpeakerService } from '../service/speaker.service';
import { SpeakerFormService, SpeakerFormGroup } from './speaker-form.service';

@Component({
  standalone: true,
  selector: 'jhi-speaker-update',
  templateUrl: './speaker-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SpeakerUpdateComponent implements OnInit {
  isSaving = false;
  speaker: ISpeaker | null = null;

  conferencesSharedCollection: IConference[] = [];

  protected speakerService = inject(SpeakerService);
  protected speakerFormService = inject(SpeakerFormService);
  protected conferenceService = inject(ConferenceService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SpeakerFormGroup = this.speakerFormService.createSpeakerFormGroup();

  compareConference = (o1: IConference | null, o2: IConference | null): boolean => this.conferenceService.compareConference(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ speaker }) => {
      this.speaker = speaker;
      if (speaker) {
        this.updateForm(speaker);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const speaker = this.speakerFormService.getSpeaker(this.editForm);
    if (speaker.id !== null) {
      this.subscribeToSaveResponse(this.speakerService.update(speaker));
    } else {
      this.subscribeToSaveResponse(this.speakerService.create(speaker));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISpeaker>>): void {
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

  protected updateForm(speaker: ISpeaker): void {
    this.speaker = speaker;
    this.speakerFormService.resetForm(this.editForm, speaker);

    this.conferencesSharedCollection = this.conferenceService.addConferenceToCollectionIfMissing<IConference>(
      this.conferencesSharedCollection,
      ...(speaker.conferences ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.conferenceService
      .query()
      .pipe(map((res: HttpResponse<IConference[]>) => res.body ?? []))
      .pipe(
        map((conferences: IConference[]) =>
          this.conferenceService.addConferenceToCollectionIfMissing<IConference>(conferences, ...(this.speaker?.conferences ?? [])),
        ),
      )
      .subscribe((conferences: IConference[]) => (this.conferencesSharedCollection = conferences));
  }
}
