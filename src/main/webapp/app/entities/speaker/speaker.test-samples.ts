import { ISpeaker, NewSpeaker } from './speaker.model';

export const sampleWithRequiredData: ISpeaker = {
  id: 16183,
};

export const sampleWithPartialData: ISpeaker = {
  id: 9913,
  fullName: 'roughly',
  email: 'Destin97@gmail.com',
  company: 'unlike',
};

export const sampleWithFullData: ISpeaker = {
  id: 15512,
  fullName: 'polarise furthermore unnecessarily',
  email: 'Flavio.Keeling44@yahoo.com',
  company: 'hence aside recognise',
};

export const sampleWithNewData: NewSpeaker = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
