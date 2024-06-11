import { IAttendee, NewAttendee } from './attendee.model';

export const sampleWithRequiredData: IAttendee = {
  id: 8321,
};

export const sampleWithPartialData: IAttendee = {
  id: 18387,
  lastName: 'Dibbert',
  email: 'Gerry_Harber90@hotmail.com',
  telephone: '1-411-636-0588',
};

export const sampleWithFullData: IAttendee = {
  id: 20106,
  firstName: 'Ibrahim',
  lastName: 'Bogisich',
  email: 'Lottie68@gmail.com',
  telephone: '869.252.6795 x250',
};

export const sampleWithNewData: NewAttendee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
