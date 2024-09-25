import { IDataset } from './dataset.model';

export interface ISchemaMeta {
  name?: string;
  type?: string;
  data?: IDataset[];
  latitude?: number | null;
  longitude?: number | null;
  isTimeSeries?: boolean;
}

export const defaultValue: Readonly<ISchemaMeta> = {};
