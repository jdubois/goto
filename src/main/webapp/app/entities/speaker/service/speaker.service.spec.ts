import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISpeaker } from '../speaker.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../speaker.test-samples';

import { SpeakerService } from './speaker.service';

const requireRestSample: ISpeaker = {
  ...sampleWithRequiredData,
};

describe('Speaker Service', () => {
  let service: SpeakerService;
  let httpMock: HttpTestingController;
  let expectedResult: ISpeaker | ISpeaker[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SpeakerService);
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

    it('should create a Speaker', () => {
      const speaker = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(speaker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Speaker', () => {
      const speaker = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(speaker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Speaker', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Speaker', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Speaker', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSpeakerToCollectionIfMissing', () => {
      it('should add a Speaker to an empty array', () => {
        const speaker: ISpeaker = sampleWithRequiredData;
        expectedResult = service.addSpeakerToCollectionIfMissing([], speaker);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(speaker);
      });

      it('should not add a Speaker to an array that contains it', () => {
        const speaker: ISpeaker = sampleWithRequiredData;
        const speakerCollection: ISpeaker[] = [
          {
            ...speaker,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSpeakerToCollectionIfMissing(speakerCollection, speaker);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Speaker to an array that doesn't contain it", () => {
        const speaker: ISpeaker = sampleWithRequiredData;
        const speakerCollection: ISpeaker[] = [sampleWithPartialData];
        expectedResult = service.addSpeakerToCollectionIfMissing(speakerCollection, speaker);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(speaker);
      });

      it('should add only unique Speaker to an array', () => {
        const speakerArray: ISpeaker[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const speakerCollection: ISpeaker[] = [sampleWithRequiredData];
        expectedResult = service.addSpeakerToCollectionIfMissing(speakerCollection, ...speakerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const speaker: ISpeaker = sampleWithRequiredData;
        const speaker2: ISpeaker = sampleWithPartialData;
        expectedResult = service.addSpeakerToCollectionIfMissing([], speaker, speaker2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(speaker);
        expect(expectedResult).toContain(speaker2);
      });

      it('should accept null and undefined values', () => {
        const speaker: ISpeaker = sampleWithRequiredData;
        expectedResult = service.addSpeakerToCollectionIfMissing([], null, speaker, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(speaker);
      });

      it('should return initial array if no Speaker is added', () => {
        const speakerCollection: ISpeaker[] = [sampleWithRequiredData];
        expectedResult = service.addSpeakerToCollectionIfMissing(speakerCollection, undefined, null);
        expect(expectedResult).toEqual(speakerCollection);
      });
    });

    describe('compareSpeaker', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSpeaker(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSpeaker(entity1, entity2);
        const compareResult2 = service.compareSpeaker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSpeaker(entity1, entity2);
        const compareResult2 = service.compareSpeaker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSpeaker(entity1, entity2);
        const compareResult2 = service.compareSpeaker(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
