import { IConference } from 'app/entities/conference/conference.model';

export interface ISpeaker {
  id: number;
  fullName?: string | null;
  email?: string | null;
  company?: string | null;
  conferences?: IConference[] | null;
}

export type NewSpeaker = Omit<ISpeaker, 'id'> & { id: null };
