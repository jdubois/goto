import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../speaker.test-samples';

import { SpeakerFormService } from './speaker-form.service';

describe('Speaker Form Service', () => {
  let service: SpeakerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeakerFormService);
  });

  describe('Service methods', () => {
    describe('createSpeakerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSpeakerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fullName: expect.any(Object),
            email: expect.any(Object),
            company: expect.any(Object),
            conferences: expect.any(Object),
          }),
        );
      });

      it('passing ISpeaker should create a new form with FormGroup', () => {
        const formGroup = service.createSpeakerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fullName: expect.any(Object),
            email: expect.any(Object),
            company: expect.any(Object),
            conferences: expect.any(Object),
          }),
        );
      });
    });

    describe('getSpeaker', () => {
      it('should return NewSpeaker for default Speaker initial value', () => {
        const formGroup = service.createSpeakerFormGroup(sampleWithNewData);

        const speaker = service.getSpeaker(formGroup) as any;

        expect(speaker).toMatchObject(sampleWithNewData);
      });

      it('should return NewSpeaker for empty Speaker initial value', () => {
        const formGroup = service.createSpeakerFormGroup();

        const speaker = service.getSpeaker(formGroup) as any;

        expect(speaker).toMatchObject({});
      });

      it('should return ISpeaker', () => {
        const formGroup = service.createSpeakerFormGroup(sampleWithRequiredData);

        const speaker = service.getSpeaker(formGroup) as any;

        expect(speaker).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISpeaker should not enable id FormControl', () => {
        const formGroup = service.createSpeakerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSpeaker should disable id FormControl', () => {
        const formGroup = service.createSpeakerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
