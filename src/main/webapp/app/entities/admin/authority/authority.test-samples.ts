import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '9be6ccce-3cf5-41f6-84e4-f41e6509a8cf',
};

export const sampleWithPartialData: IAuthority = {
  name: '808da1a9-7dab-46c2-9b72-0be59c4c6792',
};

export const sampleWithFullData: IAuthority = {
  name: '44a4e156-0a38-4845-8224-3baf3b19a344',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
