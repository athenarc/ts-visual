import { ITimeRange } from 'app/shared/model/time-range.model';

export interface IChangepointDate {
  range: ITimeRange;
  measure: number;
  measureChartId: number;
  score: number;
  id: number;
}

export const defaultValue: Readonly<IChangepointDate> = { range: null, id: null, measure: null, measureChartId: null, score: null };
