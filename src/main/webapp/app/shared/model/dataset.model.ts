interface IDatasetTimeRange {
  from: number;
  to: number;
  fromDate: string;
  toDate: string;
  intervalString: string;
}

export interface IDataset {
  config?: string | null;
  fileInfoList?: string[];
  header?: string[];
  id?: string | null;
  idCol?: string | null;
  measures?: number[];
  name?: string;
  path?: string | null;
  samplingInterval?: string | null;
  schema?: string | null;
  table?: string | null;
  timeCol?: string | null;
  timeFormat?: string | null;
  timeRange?: IDatasetTimeRange;
  type?: string;
  valueCol?: string;
  isConfiged?: boolean;
}

export const defaultValue: Readonly<IDataset> = {};
