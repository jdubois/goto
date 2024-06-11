import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 22827,
  login: 'eEJT',
};

export const sampleWithPartialData: IUser = {
  id: 31431,
  login: '28|t@BO\\dO\\+jJuZI\\WB\\%fi\\[0HQFI',
};

export const sampleWithFullData: IUser = {
  id: 13953,
  login: 'tjp',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
