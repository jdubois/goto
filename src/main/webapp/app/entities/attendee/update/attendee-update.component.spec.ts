import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { ISession } from 'app/entities/session/session.model';
import { SessionService } from 'app/entities/session/service/session.service';
import { AttendeeService } from '../service/attendee.service';
import { IAttendee } from '../attendee.model';
import { AttendeeFormService } from './attendee-form.service';

import { AttendeeUpdateComponent } from './attendee-update.component';

describe('Attendee Management Update Component', () => {
  let comp: AttendeeUpdateComponent;
  let fixture: ComponentFixture<AttendeeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let attendeeFormService: AttendeeFormService;
  let attendeeService: AttendeeService;
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AttendeeUpdateComponent],
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
      .overrideTemplate(AttendeeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AttendeeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    attendeeFormService = TestBed.inject(AttendeeFormService);
    attendeeService = TestBed.inject(AttendeeService);
    sessionService = TestBed.inject(SessionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Session query and add missing value', () => {
      const attendee: IAttendee = { id: 456 };
      const sessions: ISession[] = [{ id: 18540 }];
      attendee.sessions = sessions;

      const sessionCollection: ISession[] = [{ id: 3721 }];
      jest.spyOn(sessionService, 'query').mockReturnValue(of(new HttpResponse({ body: sessionCollection })));
      const additionalSessions = [...sessions];
      const expectedCollection: ISession[] = [...additionalSessions, ...sessionCollection];
      jest.spyOn(sessionService, 'addSessionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attendee });
      comp.ngOnInit();

      expect(sessionService.query).toHaveBeenCalled();
      expect(sessionService.addSessionToCollectionIfMissing).toHaveBeenCalledWith(
        sessionCollection,
        ...additionalSessions.map(expect.objectContaining),
      );
      expect(comp.sessionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const attendee: IAttendee = { id: 456 };
      const session: ISession = { id: 24811 };
      attendee.sessions = [session];

      activatedRoute.data = of({ attendee });
      comp.ngOnInit();

      expect(comp.sessionsSharedCollection).toContain(session);
      expect(comp.attendee).toEqual(attendee);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttendee>>();
      const attendee = { id: 123 };
      jest.spyOn(attendeeFormService, 'getAttendee').mockReturnValue(attendee);
      jest.spyOn(attendeeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attendee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attendee }));
      saveSubject.complete();

      // THEN
      expect(attendeeFormService.getAttendee).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(attendeeService.update).toHaveBeenCalledWith(expect.objectContaining(attendee));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttendee>>();
      const attendee = { id: 123 };
      jest.spyOn(attendeeFormService, 'getAttendee').mockReturnValue({ id: null });
      jest.spyOn(attendeeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attendee: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attendee }));
      saveSubject.complete();

      // THEN
      expect(attendeeFormService.getAttendee).toHaveBeenCalled();
      expect(attendeeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttendee>>();
      const attendee = { id: 123 };
      jest.spyOn(attendeeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attendee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(attendeeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSession', () => {
      it('Should forward to sessionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(sessionService, 'compareSession');
        comp.compareSession(entity, entity2);
        expect(sessionService.compareSession).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
