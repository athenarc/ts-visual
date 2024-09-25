import { IDataPoint } from './data-point.model';
import { IQueryTimeRange } from './query-time-range';

export interface IQueryResults {
  aggFactor: number;
  error: string | null;
  flag: boolean;
  groupByResults: string | null;
  ioCount: number;
  data: IDataPoint[];
  measureStats: any;
  progressiveQueryTime: number;
  queryTime: number;
  timeRange: IQueryTimeRange;
}
