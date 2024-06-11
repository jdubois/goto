import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { ISpeaker } from 'app/entities/speaker/speaker.model';
import { SpeakerService } from 'app/entities/speaker/service/speaker.service';
import { IConference } from 'app/entities/conference/conference.model';
import { ConferenceService } from 'app/entities/conference/service/conference.service';
import { IAttendee } from 'app/entities/attendee/attendee.model';
import { AttendeeService } from 'app/entities/attendee/service/attendee.service';
import { ISession } from '../session.model';
import { SessionService } from '../service/session.service';
import { SessionFormService } from './session-form.service';

import { SessionUpdateComponent } from './session-update.component';

describe('Session Management Update Component', () => {
  let comp: SessionUpdateComponent;
  let fixture: ComponentFixture<SessionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sessionFormService: SessionFormService;
  let sessionService: SessionService;
  let speakerService: SpeakerService;
  let conferenceService: ConferenceService;
  let attendeeService: AttendeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SessionUpdateComponent],
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
      .overrideTemplate(SessionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SessionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sessionFormService = TestBed.inject(SessionFormService);
    sessionService = TestBed.inject(SessionService);
    speakerService = TestBed.inject(SpeakerService);
    conferenceService = TestBed.inject(ConferenceService);
    attendeeService = TestBed.inject(AttendeeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Speaker query and add missing value', () => {
      const session: ISession = { id: 456 };
      const speaker: ISpeaker = { id: 2439 };
      session.speaker = speaker;

      const speakerCollection: ISpeaker[] = [{ id: 11943 }];
      jest.spyOn(speakerService, 'query').mockReturnValue(of(new HttpResponse({ body: speakerCollection })));
      const additionalSpeakers = [speaker];
      const expectedCollection: ISpeaker[] = [...additionalSpeakers, ...speakerCollection];
      jest.spyOn(speakerService, 'addSpeakerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ session });
      comp.ngOnInit();

      expect(speakerService.query).toHaveBeenCalled();
      expect(speakerService.addSpeakerToCollectionIfMissing).toHaveBeenCalledWith(
        speakerCollection,
        ...additionalSpeakers.map(expect.objectContaining),
      );
      expect(comp.speakersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Conference query and add missing value', () => {
      const session: ISession = { id: 456 };
      const conference: IConference = { id: 25536 };
      session.conference = conference;

      const conferenceCollection: IConference[] = [{ id: 2774 }];
      jest.spyOn(conferenceService, 'query').mockReturnValue(of(new HttpResponse({ body: conferenceCollection })));
      const additionalConferences = [conference];
      const expectedCollection: IConference[] = [...additionalConferences, ...conferenceCollection];
      jest.spyOn(conferenceService, 'addConferenceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ session });
      comp.ngOnInit();

      expect(conferenceService.query).toHaveBeenCalled();
      expect(conferenceService.addConferenceToCollectionIfMissing).toHaveBeenCalledWith(
        conferenceCollection,
        ...additionalConferences.map(expect.objectContaining),
      );
      expect(comp.conferencesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Attendee query and add missing value', () => {
      const session: ISession = { id: 456 };
      const attendees: IAttendee[] = [{ id: 10526 }];
      session.attendees = attendees;

      const attendeeCollection: IAttendee[] = [{ id: 3560 }];
      jest.spyOn(attendeeService, 'query').mockReturnValue(of(new HttpResponse({ body: attendeeCollection })));
      const additionalAttendees = [...attendees];
      const expectedCollection: IAttendee[] = [...additionalAttendees, ...attendeeCollection];
      jest.spyOn(attendeeService, 'addAttendeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ session });
      comp.ngOnInit();

      expect(attendeeService.query).toHaveBeenCalled();
      expect(attendeeService.addAttendeeToCollectionIfMissing).toHaveBeenCalledWith(
        attendeeCollection,
        ...additionalAttendees.map(expect.objectContaining),
      );
      expect(comp.attendeesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const session: ISession = { id: 456 };
      const speaker: ISpeaker = { id: 27535 };
      session.speaker = speaker;
      const conference: IConference = { id: 30203 };
      session.conference = conference;
      const attendee: IAttendee = { id: 5394 };
      session.attendees = [attendee];

      activatedRoute.data = of({ session });
      comp.ngOnInit();

      expect(comp.speakersSharedCollection).toContain(speaker);
      expect(comp.conferencesSharedCollection).toContain(conference);
      expect(comp.attendeesSharedCollection).toContain(attendee);
      expect(comp.session).toEqual(session);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISession>>();
      const session = { id: 123 };
      jest.spyOn(sessionFormService, 'getSession').mockReturnValue(session);
      jest.spyOn(sessionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ session });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: session }));
      saveSubject.complete();

      // THEN
      expect(sessionFormService.getSession).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sessionService.update).toHaveBeenCalledWith(expect.objectContaining(session));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISession>>();
      const session = { id: 123 };
      jest.spyOn(sessionFormService, 'getSession').mockReturnValue({ id: null });
      jest.spyOn(sessionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ session: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: session }));
      saveSubject.complete();

      // THEN
      expect(sessionFormService.getSession).toHaveBeenCalled();
      expect(sessionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISession>>();
      const session = { id: 123 };
      jest.spyOn(sessionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ session });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sessionService.update).toHaveBeenCalled();
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

    describe('compareConference', () => {
      it('Should forward to conferenceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(conferenceService, 'compareConference');
        comp.compareConference(entity, entity2);
        expect(conferenceService.compareConference).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAttendee', () => {
      it('Should forward to attendeeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(attendeeService, 'compareAttendee');
        comp.compareAttendee(entity, entity2);
        expect(attendeeService.compareAttendee).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
