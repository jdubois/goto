import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISession, NewSession } from '../session.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISession for edit and NewSessionFormGroupInput for create.
 */
type SessionFormGroupInput = ISession | PartialWithRequiredKeyOf<NewSession>;

type SessionFormDefaults = Pick<NewSession, 'id' | 'attendees'>;

type SessionFormGroupContent = {
  id: FormControl<ISession['id'] | NewSession['id']>;
  title: FormControl<ISession['title']>;
  description: FormControl<ISession['description']>;
  room: FormControl<ISession['room']>;
  speaker: FormControl<ISession['speaker']>;
  conference: FormControl<ISession['conference']>;
  attendees: FormControl<ISession['attendees']>;
};

export type SessionFormGroup = FormGroup<SessionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SessionFormService {
  createSessionFormGroup(session: SessionFormGroupInput = { id: null }): SessionFormGroup {
    const sessionRawValue = {
      ...this.getFormDefaults(),
      ...session,
    };
    return new FormGroup<SessionFormGroupContent>({
      id: new FormControl(
        { value: sessionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(sessionRawValue.title, {
        validators: [Validators.required],
      }),
      description: new FormControl(sessionRawValue.description),
      room: new FormControl(sessionRawValue.room),
      speaker: new FormControl(sessionRawValue.speaker),
      conference: new FormControl(sessionRawValue.conference),
      attendees: new FormControl(sessionRawValue.attendees ?? []),
    });
  }

  getSession(form: SessionFormGroup): ISession | NewSession {
    return form.getRawValue() as ISession | NewSession;
  }

  resetForm(form: SessionFormGroup, session: SessionFormGroupInput): void {
    const sessionRawValue = { ...this.getFormDefaults(), ...session };
    form.reset(
      {
        ...sessionRawValue,
        id: { value: sessionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SessionFormDefaults {
    return {
      id: null,
      attendees: [],
    };
  }
}
