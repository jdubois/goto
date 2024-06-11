import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAttendee, NewAttendee } from '../attendee.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAttendee for edit and NewAttendeeFormGroupInput for create.
 */
type AttendeeFormGroupInput = IAttendee | PartialWithRequiredKeyOf<NewAttendee>;

type AttendeeFormDefaults = Pick<NewAttendee, 'id' | 'sessions'>;

type AttendeeFormGroupContent = {
  id: FormControl<IAttendee['id'] | NewAttendee['id']>;
  firstName: FormControl<IAttendee['firstName']>;
  lastName: FormControl<IAttendee['lastName']>;
  email: FormControl<IAttendee['email']>;
  telephone: FormControl<IAttendee['telephone']>;
  sessions: FormControl<IAttendee['sessions']>;
};

export type AttendeeFormGroup = FormGroup<AttendeeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AttendeeFormService {
  createAttendeeFormGroup(attendee: AttendeeFormGroupInput = { id: null }): AttendeeFormGroup {
    const attendeeRawValue = {
      ...this.getFormDefaults(),
      ...attendee,
    };
    return new FormGroup<AttendeeFormGroupContent>({
      id: new FormControl(
        { value: attendeeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      firstName: new FormControl(attendeeRawValue.firstName),
      lastName: new FormControl(attendeeRawValue.lastName),
      email: new FormControl(attendeeRawValue.email),
      telephone: new FormControl(attendeeRawValue.telephone),
      sessions: new FormControl(attendeeRawValue.sessions ?? []),
    });
  }

  getAttendee(form: AttendeeFormGroup): IAttendee | NewAttendee {
    return form.getRawValue() as IAttendee | NewAttendee;
  }

  resetForm(form: AttendeeFormGroup, attendee: AttendeeFormGroupInput): void {
    const attendeeRawValue = { ...this.getFormDefaults(), ...attendee };
    form.reset(
      {
        ...attendeeRawValue,
        id: { value: attendeeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AttendeeFormDefaults {
    return {
      id: null,
      sessions: [],
    };
  }
}
