import dayjs from 'dayjs/esm';
import { ISpeaker } from 'app/entities/speaker/speaker.model';

export interface IConference {
  id: number;
  title?: string | null;
  description?: string | null;
  date?: dayjs.Dayjs | null;
  palce?: string | null;
  speakers?: ISpeaker[] | null;
}

export type NewConference = Omit<IConference, 'id'> & { id: null };
