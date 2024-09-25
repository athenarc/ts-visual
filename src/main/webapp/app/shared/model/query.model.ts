import { IViewPort } from 'app/shared/model/viewport.model';

export interface IQuery {
  from?: number;
  to?: number;
  measures?: number[];
  viewPort?: IViewPort;
  filter?: {};
  secondaryMeasures?: number[];
}

// export const defaultValue: Readonly<IQuery> = { range: { from: 1514939111400, to: 1514941728600 }, frequency: 'MINUTE' };
export const defaultValue: Readonly<IQuery> = { from: null, to: null, measures: null, viewPort: null };
