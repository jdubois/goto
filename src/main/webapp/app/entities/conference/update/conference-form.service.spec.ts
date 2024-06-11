import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../conference.test-samples';

import { ConferenceFormService } from './conference-form.service';

describe('Conference Form Service', () => {
  let service: ConferenceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConferenceFormService);
  });

  describe('Service methods', () => {
    describe('createConferenceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createConferenceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            date: expect.any(Object),
            palce: expect.any(Object),
            speakers: expect.any(Object),
          }),
        );
      });

      it('passing IConference should create a new form with FormGroup', () => {
        const formGroup = service.createConferenceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            description: expect.any(Object),
            date: expect.any(Object),
            palce: expect.any(Object),
            speakers: expect.any(Object),
          }),
        );
      });
    });

    describe('getConference', () => {
      it('should return NewConference for default Conference initial value', () => {
        const formGroup = service.createConferenceFormGroup(sampleWithNewData);

        const conference = service.getConference(formGroup) as any;

        expect(conference).toMatchObject(sampleWithNewData);
      });

      it('should return NewConference for empty Conference initial value', () => {
        const formGroup = service.createConferenceFormGroup();

        const conference = service.getConference(formGroup) as any;

        expect(conference).toMatchObject({});
      });

      it('should return IConference', () => {
        const formGroup = service.createConferenceFormGroup(sampleWithRequiredData);

        const conference = service.getConference(formGroup) as any;

        expect(conference).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IConference should not enable id FormControl', () => {
        const formGroup = service.createConferenceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewConference should disable id FormControl', () => {
        const formGroup = service.createConferenceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
