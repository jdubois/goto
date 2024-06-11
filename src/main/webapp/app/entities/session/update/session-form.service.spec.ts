import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../session.test-samples';

import { SessionFormService } from './session-form.service';

describe('Session Form Service', () => {
  let service: SessionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionFormService);
  });

  describe('Service methods', () => {
    describe('createSessionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSessionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            room: expect.any(Object),
            speaker: expect.any(Object),
            conference: expect.any(Object),
            attendees: expect.any(Object),
          }),
        );
      });

      it('passing ISession should create a new form with FormGroup', () => {
        const formGroup = service.createSessionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            room: expect.any(Object),
            speaker: expect.any(Object),
            conference: expect.any(Object),
            attendees: expect.any(Object),
          }),
        );
      });
    });

    describe('getSession', () => {
      it('should return NewSession for default Session initial value', () => {
        const formGroup = service.createSessionFormGroup(sampleWithNewData);

        const session = service.getSession(formGroup) as any;

        expect(session).toMatchObject(sampleWithNewData);
      });

      it('should return NewSession for empty Session initial value', () => {
        const formGroup = service.createSessionFormGroup();

        const session = service.getSession(formGroup) as any;

        expect(session).toMatchObject({});
      });

      it('should return ISession', () => {
        const formGroup = service.createSessionFormGroup(sampleWithRequiredData);

        const session = service.getSession(formGroup) as any;

        expect(session).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISession should not enable id FormControl', () => {
        const formGroup = service.createSessionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSession should disable id FormControl', () => {
        const formGroup = service.createSessionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
