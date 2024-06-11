import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IConference } from '../conference.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../conference.test-samples';

import { ConferenceService, RestConference } from './conference.service';

const requireRestSample: RestConference = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('Conference Service', () => {
  let service: ConferenceService;
  let httpMock: HttpTestingController;
  let expectedResult: IConference | IConference[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ConferenceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Conference', () => {
      const conference = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(conference).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Conference', () => {
      const conference = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(conference).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Conference', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Conference', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Conference', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addConferenceToCollectionIfMissing', () => {
      it('should add a Conference to an empty array', () => {
        const conference: IConference = sampleWithRequiredData;
        expectedResult = service.addConferenceToCollectionIfMissing([], conference);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(conference);
      });

      it('should not add a Conference to an array that contains it', () => {
        const conference: IConference = sampleWithRequiredData;
        const conferenceCollection: IConference[] = [
          {
            ...conference,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addConferenceToCollectionIfMissing(conferenceCollection, conference);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Conference to an array that doesn't contain it", () => {
        const conference: IConference = sampleWithRequiredData;
        const conferenceCollection: IConference[] = [sampleWithPartialData];
        expectedResult = service.addConferenceToCollectionIfMissing(conferenceCollection, conference);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(conference);
      });

      it('should add only unique Conference to an array', () => {
        const conferenceArray: IConference[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const conferenceCollection: IConference[] = [sampleWithRequiredData];
        expectedResult = service.addConferenceToCollectionIfMissing(conferenceCollection, ...conferenceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const conference: IConference = sampleWithRequiredData;
        const conference2: IConference = sampleWithPartialData;
        expectedResult = service.addConferenceToCollectionIfMissing([], conference, conference2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(conference);
        expect(expectedResult).toContain(conference2);
      });

      it('should accept null and undefined values', () => {
        const conference: IConference = sampleWithRequiredData;
        expectedResult = service.addConferenceToCollectionIfMissing([], null, conference, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(conference);
      });

      it('should return initial array if no Conference is added', () => {
        const conferenceCollection: IConference[] = [sampleWithRequiredData];
        expectedResult = service.addConferenceToCollectionIfMissing(conferenceCollection, undefined, null);
        expect(expectedResult).toEqual(conferenceCollection);
      });
    });

    describe('compareConference', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareConference(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareConference(entity1, entity2);
        const compareResult2 = service.compareConference(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareConference(entity1, entity2);
        const compareResult2 = service.compareConference(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareConference(entity1, entity2);
        const compareResult2 = service.compareConference(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
