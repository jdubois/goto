import { ISession } from 'app/entities/session/session.model';

export interface IAttendee {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  telephone?: string | null;
  sessions?: ISession[] | null;
}

export type NewAttendee = Omit<IAttendee, 'id'> & { id: null };
