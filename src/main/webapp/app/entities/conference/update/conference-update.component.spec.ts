import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { ISpeaker } from 'app/entities/speaker/speaker.model';
import { SpeakerService } from 'app/entities/speaker/service/speaker.service';
import { ConferenceService } from '../service/conference.service';
import { IConference } from '../conference.model';
import { ConferenceFormService } from './conference-form.service';

import { ConferenceUpdateComponent } from './conference-update.component';

describe('Conference Management Update Component', () => {
  let comp: ConferenceUpdateComponent;
  let fixture: ComponentFixture<ConferenceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let conferenceFormService: ConferenceFormService;
  let conferenceService: ConferenceService;
  let speakerService: SpeakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ConferenceUpdateComponent],
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
      .overrideTemplate(ConferenceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConferenceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    conferenceFormService = TestBed.inject(ConferenceFormService);
    conferenceService = TestBed.inject(ConferenceService);
    speakerService = TestBed.inject(SpeakerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Speaker query and add missing value', () => {
      const conference: IConference = { id: 456 };
      const speakers: ISpeaker[] = [{ id: 2509 }];
      conference.speakers = speakers;

      const speakerCollection: ISpeaker[] = [{ id: 27289 }];
      jest.spyOn(speakerService, 'query').mockReturnValue(of(new HttpResponse({ body: speakerCollection })));
      const additionalSpeakers = [...speakers];
      const expectedCollection: ISpeaker[] = [...additionalSpeakers, ...speakerCollection];
      jest.spyOn(speakerService, 'addSpeakerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ conference });
      comp.ngOnInit();

      expect(speakerService.query).toHaveBeenCalled();
      expect(speakerService.addSpeakerToCollectionIfMissing).toHaveBeenCalledWith(
        speakerCollection,
        ...additionalSpeakers.map(expect.objectContaining),
      );
      expect(comp.speakersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const conference: IConference = { id: 456 };
      const speaker: ISpeaker = { id: 18014 };
      conference.speakers = [speaker];

      activatedRoute.data = of({ conference });
      comp.ngOnInit();

      expect(comp.speakersSharedCollection).toContain(speaker);
      expect(comp.conference).toEqual(conference);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConference>>();
      const conference = { id: 123 };
      jest.spyOn(conferenceFormService, 'getConference').mockReturnValue(conference);
      jest.spyOn(conferenceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conference });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: conference }));
      saveSubject.complete();

      // THEN
      expect(conferenceFormService.getConference).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(conferenceService.update).toHaveBeenCalledWith(expect.objectContaining(conference));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConference>>();
      const conference = { id: 123 };
      jest.spyOn(conferenceFormService, 'getConference').mockReturnValue({ id: null });
      jest.spyOn(conferenceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conference: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: conference }));
      saveSubject.complete();

      // THEN
      expect(conferenceFormService.getConference).toHaveBeenCalled();
      expect(conferenceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConference>>();
      const conference = { id: 123 };
      jest.spyOn(conferenceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conference });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(conferenceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSpeaker', () => {
      it('Should forward to speakerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(speakerService, 'compareSpeaker');
        comp.compareSpeaker(entity, entity2);
        expect(speakerService.compareSpeaker).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
