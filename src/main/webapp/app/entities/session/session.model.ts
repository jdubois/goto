import { ISpeaker } from 'app/entities/speaker/speaker.model';
import { IConference } from 'app/entities/conference/conference.model';
import { IAttendee } from 'app/entities/attendee/attendee.model';

export interface ISession {
  id: number;
  title?: string | null;
  description?: string | null;
  room?: string | null;
  speaker?: ISpeaker | null;
  conference?: IConference | null;
  attendees?: IAttendee[] | null;
}

export type NewSession = Omit<ISession, 'id'> & { id: null };
