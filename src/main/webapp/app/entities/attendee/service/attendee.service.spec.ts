import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAttendee } from '../attendee.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../attendee.test-samples';

import { AttendeeService } from './attendee.service';

const requireRestSample: IAttendee = {
  ...sampleWithRequiredData,
};

describe('Attendee Service', () => {
  let service: AttendeeService;
  let httpMock: HttpTestingController;
  let expectedResult: IAttendee | IAttendee[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AttendeeService);
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

    it('should create a Attendee', () => {
      const attendee = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(attendee).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Attendee', () => {
      const attendee = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(attendee).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Attendee', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Attendee', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Attendee', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAttendeeToCollectionIfMissing', () => {
      it('should add a Attendee to an empty array', () => {
        const attendee: IAttendee = sampleWithRequiredData;
        expectedResult = service.addAttendeeToCollectionIfMissing([], attendee);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attendee);
      });

      it('should not add a Attendee to an array that contains it', () => {
        const attendee: IAttendee = sampleWithRequiredData;
        const attendeeCollection: IAttendee[] = [
          {
            ...attendee,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAttendeeToCollectionIfMissing(attendeeCollection, attendee);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Attendee to an array that doesn't contain it", () => {
        const attendee: IAttendee = sampleWithRequiredData;
        const attendeeCollection: IAttendee[] = [sampleWithPartialData];
        expectedResult = service.addAttendeeToCollectionIfMissing(attendeeCollection, attendee);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attendee);
      });

      it('should add only unique Attendee to an array', () => {
        const attendeeArray: IAttendee[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const attendeeCollection: IAttendee[] = [sampleWithRequiredData];
        expectedResult = service.addAttendeeToCollectionIfMissing(attendeeCollection, ...attendeeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const attendee: IAttendee = sampleWithRequiredData;
        const attendee2: IAttendee = sampleWithPartialData;
        expectedResult = service.addAttendeeToCollectionIfMissing([], attendee, attendee2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(attendee);
        expect(expectedResult).toContain(attendee2);
      });

      it('should accept null and undefined values', () => {
        const attendee: IAttendee = sampleWithRequiredData;
        expectedResult = service.addAttendeeToCollectionIfMissing([], null, attendee, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(attendee);
      });

      it('should return initial array if no Attendee is added', () => {
        const attendeeCollection: IAttendee[] = [sampleWithRequiredData];
        expectedResult = service.addAttendeeToCollectionIfMissing(attendeeCollection, undefined, null);
        expect(expectedResult).toEqual(attendeeCollection);
      });
    });

    describe('compareAttendee', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAttendee(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAttendee(entity1, entity2);
        const compareResult2 = service.compareAttendee(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAttendee(entity1, entity2);
        const compareResult2 = service.compareAttendee(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAttendee(entity1, entity2);
        const compareResult2 = service.compareAttendee(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
