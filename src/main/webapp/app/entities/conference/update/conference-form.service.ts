import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IConference, NewConference } from '../conference.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IConference for edit and NewConferenceFormGroupInput for create.
 */
type ConferenceFormGroupInput = IConference | PartialWithRequiredKeyOf<NewConference>;

type ConferenceFormDefaults = Pick<NewConference, 'id' | 'speakers'>;

type ConferenceFormGroupContent = {
  id: FormControl<IConference['id'] | NewConference['id']>;
  title: FormControl<IConference['title']>;
  description: FormControl<IConference['description']>;
  date: FormControl<IConference['date']>;
  palce: FormControl<IConference['palce']>;
  speakers: FormControl<IConference['speakers']>;
};

export type ConferenceFormGroup = FormGroup<ConferenceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ConferenceFormService {
  createConferenceFormGroup(conference: ConferenceFormGroupInput = { id: null }): ConferenceFormGroup {
    const conferenceRawValue = {
      ...this.getFormDefaults(),
      ...conference,
    };
    return new FormGroup<ConferenceFormGroupContent>({
      id: new FormControl(
        { value: conferenceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(conferenceRawValue.title, {
        validators: [Validators.required],
      }),
      description: new FormControl(conferenceRawValue.description),
      date: new FormControl(conferenceRawValue.date),
      palce: new FormControl(conferenceRawValue.palce),
      speakers: new FormControl(conferenceRawValue.speakers ?? []),
    });
  }

  getConference(form: ConferenceFormGroup): IConference | NewConference {
    return form.getRawValue() as IConference | NewConference;
  }

  resetForm(form: ConferenceFormGroup, conference: ConferenceFormGroupInput): void {
    const conferenceRawValue = { ...this.getFormDefaults(), ...conference };
    form.reset(
      {
        ...conferenceRawValue,
        id: { value: conferenceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ConferenceFormDefaults {
    return {
      id: null,
      speakers: [],
    };
  }
}
