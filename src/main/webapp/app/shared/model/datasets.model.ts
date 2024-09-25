import { IDataset } from './dataset.model';

export interface IDatasets {
  data: IDataset[];
  loading: boolean;
  error: string | null;
}

export const defaultDatasets: Readonly<IDatasets> = { data: [], loading: false, error: null };
