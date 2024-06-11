import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISpeaker, NewSpeaker } from '../speaker.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISpeaker for edit and NewSpeakerFormGroupInput for create.
 */
type SpeakerFormGroupInput = ISpeaker | PartialWithRequiredKeyOf<NewSpeaker>;

type SpeakerFormDefaults = Pick<NewSpeaker, 'id' | 'conferences'>;

type SpeakerFormGroupContent = {
  id: FormControl<ISpeaker['id'] | NewSpeaker['id']>;
  fullName: FormControl<ISpeaker['fullName']>;
  email: FormControl<ISpeaker['email']>;
  company: FormControl<ISpeaker['company']>;
  conferences: FormControl<ISpeaker['conferences']>;
};

export type SpeakerFormGroup = FormGroup<SpeakerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SpeakerFormService {
  createSpeakerFormGroup(speaker: SpeakerFormGroupInput = { id: null }): SpeakerFormGroup {
    const speakerRawValue = {
      ...this.getFormDefaults(),
      ...speaker,
    };
    return new FormGroup<SpeakerFormGroupContent>({
      id: new FormControl(
        { value: speakerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      fullName: new FormControl(speakerRawValue.fullName),
      email: new FormControl(speakerRawValue.email),
      company: new FormControl(speakerRawValue.company),
      conferences: new FormControl(speakerRawValue.conferences ?? []),
    });
  }

  getSpeaker(form: SpeakerFormGroup): ISpeaker | NewSpeaker {
    return form.getRawValue() as ISpeaker | NewSpeaker;
  }

  resetForm(form: SpeakerFormGroup, speaker: SpeakerFormGroupInput): void {
    const speakerRawValue = { ...this.getFormDefaults(), ...speaker };
    form.reset(
      {
        ...speakerRawValue,
        id: { value: speakerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SpeakerFormDefaults {
    return {
      id: null,
      conferences: [],
    };
  }
}
