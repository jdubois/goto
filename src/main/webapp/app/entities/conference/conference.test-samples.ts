import dayjs from 'dayjs/esm';

import { IConference, NewConference } from './conference.model';

export const sampleWithRequiredData: IConference = {
  id: 6734,
  title: 'instead badly',
};

export const sampleWithPartialData: IConference = {
  id: 11185,
  title: 'sparse',
  palce: 'inside',
};

export const sampleWithFullData: IConference = {
  id: 8750,
  title: 'surprisingly cushion truthfully',
  description: 'teleconference',
  date: dayjs('2024-06-11'),
  palce: 'pertinent incidentally fast',
};

export const sampleWithNewData: NewConference = {
  title: 'like',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
