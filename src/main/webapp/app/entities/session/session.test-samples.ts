import { ISession, NewSession } from './session.model';

export const sampleWithRequiredData: ISession = {
  id: 19325,
  title: 'enormous mysteriously',
};

export const sampleWithPartialData: ISession = {
  id: 8252,
  title: 'reproachfully',
};

export const sampleWithFullData: ISession = {
  id: 30178,
  title: 'pfft',
  description: 'burn capitalise or',
  room: 'off fiercely',
};

export const sampleWithNewData: NewSession = {
  title: 'besides',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
