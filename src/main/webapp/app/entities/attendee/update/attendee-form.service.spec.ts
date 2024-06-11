import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../attendee.test-samples';

import { AttendeeFormService } from './attendee-form.service';

describe('Attendee Form Service', () => {
  let service: AttendeeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendeeFormService);
  });

  describe('Service methods', () => {
    describe('createAttendeeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAttendeeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            telephone: expect.any(Object),
            sessions: expect.any(Object),
          }),
        );
      });

      it('passing IAttendee should create a new form with FormGroup', () => {
        const formGroup = service.createAttendeeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            telephone: expect.any(Object),
            sessions: expect.any(Object),
          }),
        );
      });
    });

    describe('getAttendee', () => {
      it('should return NewAttendee for default Attendee initial value', () => {
        const formGroup = service.createAttendeeFormGroup(sampleWithNewData);

        const attendee = service.getAttendee(formGroup) as any;

        expect(attendee).toMatchObject(sampleWithNewData);
      });

      it('should return NewAttendee for empty Attendee initial value', () => {
        const formGroup = service.createAttendeeFormGroup();

        const attendee = service.getAttendee(formGroup) as any;

        expect(attendee).toMatchObject({});
      });

      it('should return IAttendee', () => {
        const formGroup = service.createAttendeeFormGroup(sampleWithRequiredData);

        const attendee = service.getAttendee(formGroup) as any;

        expect(attendee).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAttendee should not enable id FormControl', () => {
        const formGroup = service.createAttendeeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAttendee should disable id FormControl', () => {
        const formGroup = service.createAttendeeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
