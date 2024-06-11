import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { ConferenceDetailComponent } from './conference-detail.component';

describe('Conference Management Detail Component', () => {
  let comp: ConferenceDetailComponent;
  let fixture: ComponentFixture<ConferenceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ConferenceDetailComponent,
              resolve: { conference: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ConferenceDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConferenceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load conference on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ConferenceDetailComponent);

      // THEN
      expect(instance.conference()).toEqual(expect.objectContaining({ id: 123 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
