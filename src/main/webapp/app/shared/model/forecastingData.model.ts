export interface IForecastingResults {
  target?: string;
  metrics?: any[];
}

export interface IForecastingData {
  id: string;
  status: any;
  results: any;
}
export const IForecastingDataDefault: Readonly<IForecastingData> = {
  id: '',
  status: {},
  results: {},
};
