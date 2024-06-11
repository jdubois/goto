import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IConference } from 'app/entities/conference/conference.model';
import { ConferenceService } from 'app/entities/conference/service/conference.service';
import { SpeakerService } from '../service/speaker.service';
import { ISpeaker } from '../speaker.model';
import { SpeakerFormService } from './speaker-form.service';

import { SpeakerUpdateComponent } from './speaker-update.component';

describe('Speaker Management Update Component', () => {
  let comp: SpeakerUpdateComponent;
  let fixture: ComponentFixture<SpeakerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let speakerFormService: SpeakerFormService;
  let speakerService: SpeakerService;
  let conferenceService: ConferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SpeakerUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SpeakerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SpeakerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    speakerFormService = TestBed.inject(SpeakerFormService);
    speakerService = TestBed.inject(SpeakerService);
    conferenceService = TestBed.inject(ConferenceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Conference query and add missing value', () => {
      const speaker: ISpeaker = { id: 456 };
      const conferences: IConference[] = [{ id: 21882 }];
      speaker.conferences = conferences;

      const conferenceCollection: IConference[] = [{ id: 19600 }];
      jest.spyOn(conferenceService, 'query').mockReturnValue(of(new HttpResponse({ body: conferenceCollection })));
      const additionalConferences = [...conferences];
      const expectedCollection: IConference[] = [...additionalConferences, ...conferenceCollection];
      jest.spyOn(conferenceService, 'addConferenceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ speaker });
      comp.ngOnInit();

      expect(conferenceService.query).toHaveBeenCalled();
      expect(conferenceService.addConferenceToCollectionIfMissing).toHaveBeenCalledWith(
        conferenceCollection,
        ...additionalConferences.map(expect.objectContaining),
      );
      expect(comp.conferencesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const speaker: ISpeaker = { id: 456 };
      const conference: IConference = { id: 8783 };
      speaker.conferences = [conference];

      activatedRoute.data = of({ speaker });
      comp.ngOnInit();

      expect(comp.conferencesSharedCollection).toContain(conference);
      expect(comp.speaker).toEqual(speaker);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpeaker>>();
      const speaker = { id: 123 };
      jest.spyOn(speakerFormService, 'getSpeaker').mockReturnValue(speaker);
      jest.spyOn(speakerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ speaker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: speaker }));
      saveSubject.complete();

      // THEN
      expect(speakerFormService.getSpeaker).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(speakerService.update).toHaveBeenCalledWith(expect.objectContaining(speaker));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpeaker>>();
      const speaker = { id: 123 };
      jest.spyOn(speakerFormService, 'getSpeaker').mockReturnValue({ id: null });
      jest.spyOn(speakerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ speaker: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: speaker }));
      saveSubject.complete();

      // THEN
      expect(speakerFormService.getSpeaker).toHaveBeenCalled();
      expect(speakerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpeaker>>();
      const speaker = { id: 123 };
      jest.spyOn(speakerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ speaker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(speakerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareConference', () => {
      it('Should forward to conferenceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(conferenceService, 'compareConference');
        comp.compareConference(entity, entity2);
        expect(conferenceService.compareConference).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
