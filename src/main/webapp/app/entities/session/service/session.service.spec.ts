import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISession } from '../session.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../session.test-samples';

import { SessionService } from './session.service';

const requireRestSample: ISession = {
  ...sampleWithRequiredData,
};

describe('Session Service', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;
  let expectedResult: ISession | ISession[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SessionService);
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

    it('should create a Session', () => {
      const session = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(session).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Session', () => {
      const session = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(session).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Session', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Session', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Session', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSessionToCollectionIfMissing', () => {
      it('should add a Session to an empty array', () => {
        const session: ISession = sampleWithRequiredData;
        expectedResult = service.addSessionToCollectionIfMissing([], session);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(session);
      });

      it('should not add a Session to an array that contains it', () => {
        const session: ISession = sampleWithRequiredData;
        const sessionCollection: ISession[] = [
          {
            ...session,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSessionToCollectionIfMissing(sessionCollection, session);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Session to an array that doesn't contain it", () => {
        const session: ISession = sampleWithRequiredData;
        const sessionCollection: ISession[] = [sampleWithPartialData];
        expectedResult = service.addSessionToCollectionIfMissing(sessionCollection, session);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(session);
      });

      it('should add only unique Session to an array', () => {
        const sessionArray: ISession[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sessionCollection: ISession[] = [sampleWithRequiredData];
        expectedResult = service.addSessionToCollectionIfMissing(sessionCollection, ...sessionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const session: ISession = sampleWithRequiredData;
        const session2: ISession = sampleWithPartialData;
        expectedResult = service.addSessionToCollectionIfMissing([], session, session2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(session);
        expect(expectedResult).toContain(session2);
      });

      it('should accept null and undefined values', () => {
        const session: ISession = sampleWithRequiredData;
        expectedResult = service.addSessionToCollectionIfMissing([], null, session, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(session);
      });

      it('should return initial array if no Session is added', () => {
        const sessionCollection: ISession[] = [sampleWithRequiredData];
        expectedResult = service.addSessionToCollectionIfMissing(sessionCollection, undefined, null);
        expect(expectedResult).toEqual(sessionCollection);
      });
    });

    describe('compareSession', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSession(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSession(entity1, entity2);
        const compareResult2 = service.compareSession(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSession(entity1, entity2);
        const compareResult2 = service.compareSession(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSession(entity1, entity2);
        const compareResult2 = service.compareSession(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
