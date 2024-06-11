import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISpeaker } from 'app/entities/speaker/speaker.model';
import { SpeakerService } from 'app/entities/speaker/service/speaker.service';
import { IConference } from '../conference.model';
import { ConferenceService } from '../service/conference.service';
import { ConferenceFormService, ConferenceFormGroup } from './conference-form.service';

@Component({
  standalone: true,
  selector: 'jhi-conference-update',
  templateUrl: './conference-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ConferenceUpdateComponent implements OnInit {
  isSaving = false;
  conference: IConference | null = null;

  speakersSharedCollection: ISpeaker[] = [];

  protected conferenceService = inject(ConferenceService);
  protected conferenceFormService = inject(ConferenceFormService);
  protected speakerService = inject(SpeakerService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ConferenceFormGroup = this.conferenceFormService.createConferenceFormGroup();

  compareSpeaker = (o1: ISpeaker | null, o2: ISpeaker | null): boolean => this.speakerService.compareSpeaker(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ conference }) => {
      this.conference = conference;
      if (conference) {
        this.updateForm(conference);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const conference = this.conferenceFormService.getConference(this.editForm);
    if (conference.id !== null) {
      this.subscribeToSaveResponse(this.conferenceService.update(conference));
    } else {
      this.subscribeToSaveResponse(this.conferenceService.create(conference));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConference>>): void {
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

  protected updateForm(conference: IConference): void {
    this.conference = conference;
    this.conferenceFormService.resetForm(this.editForm, conference);

    this.speakersSharedCollection = this.speakerService.addSpeakerToCollectionIfMissing<ISpeaker>(
      this.speakersSharedCollection,
      ...(conference.speakers ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.speakerService
      .query()
      .pipe(map((res: HttpResponse<ISpeaker[]>) => res.body ?? []))
      .pipe(
        map((speakers: ISpeaker[]) =>
          this.speakerService.addSpeakerToCollectionIfMissing<ISpeaker>(speakers, ...(this.conference?.speakers ?? [])),
        ),
      )
      .subscribe((speakers: ISpeaker[]) => (this.speakersSharedCollection = speakers));
  }
}
