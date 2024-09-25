import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { IAlerts } from 'app/shared/model/alert.model';
import { IConnection } from 'app/shared/model/connection.model';
import { IDataPoint } from 'app/shared/model/data-point.model';
import { ISchemaMeta } from 'app/shared/model/schemaMeta';
import { IQueryResults } from 'app/shared/model/query-results.model';
import { defaultValue as defaultQuery, IQuery } from 'app/shared/model/query.model';
import {ICustomMeasure} from "app/shared/model/custom-measures.model";
import { ITimeRange } from 'app/shared/model/time-range.model';
import axios from 'axios';
import moment, { Moment } from 'moment';
import { IDatasets, defaultDatasets } from 'app/shared/model/datasets.model';
import { RootState } from './storeConfig';
import { IDataset } from 'app/shared/model/dataset.model';
import { IAlertResults } from 'app/shared/model/alert-results.model';
import { IChangepointDate } from 'app/shared/model/changepoint-date.model';
import { IViewPort } from 'app/shared/model/viewport.model';


const seedrandom = require('seedrandom');
const lvl = 64;
seedrandom('acab', { global: true });

const generateColor = () => {
  //return ("#" + (Math.floor(seedrandom()*lvl)<<16 | Math.floor(Math.random()*lvl)<<8 | Math.floor(Math.random()*lvl)).toString(16));
  var lum = -0.25;
  var hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  var rgb = '#',
    c,
    i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ('00' + c).substr(c.length);
  }
  return rgb;
};

const forecastingInitialState = {
  forecastingStartDate: null,
  forecastingEndDate: null,
  forecastingDataSplit: [60, 20, 20],
};

const calculateFreqFromDiff = (timeRange: any) => {
  const diff = moment.duration(moment(timeRange.to).diff(moment(timeRange.from))).humanize();
  if (diff.includes('month') || diff.includes('day')) {
    return 'hour';
  } else if (diff.includes('hour')) {
    return 'minute';
  } else if (diff.includes('minute') || diff.includes('second')) {
    return 'second';
  }
  return 'hour';
};


const checkConnectionInitialState = {
  checkConnectionResponse: null,
  checkConnectionLoading: false,
  checkConnectionError: false,
  selectedConnection: "CSV"
}

const initialState = {
  sessionId: null as any,
  loading: false,
  errorMessage: null,
  dataset: null,
  datasets: defaultDatasets as IDatasets,
  chartType: 'line' as String,
  queryResults: null as IQueryResults,
  data: null as any,
  m4Data: null as any,
  m4QueryResults: null as IQueryResults,
  compareData: [],
  queryResultsLoading: true as boolean,
  m4QueryResultsLoading: true as boolean,
  queryResultsCompleted: false as boolean,
  selectedMeasures: [],
  customSelectedMeasures: [] as ICustomMeasure[],
  measureColors: [],
  from: null as number,
  to: null as number,
  accuracy: null as number,
  viewPort: null as IViewPort,
  schemaMeta: null as ISchemaMeta,
  sampleFile: [],
  resampleFreq: '',
  filter: {},
  changeChart: true,
  datasetChoice: null,
  graphZoom: null,
  activeTool: null as null | string,
  compare: {} as {[key: string]: number[]},
  chartRef: null,
  showDatePick: false,
  comparePopover: false,
  singleDateValue: { start: null, end: null },
  dateValues: [],
  fixedWidth: 0,
  expand: false,
  openToolkit: false,
  forecastData: null as IDataPoint[],
  secondaryData: null as IDataPoint[],
  customChangepoints: [] as IChangepointDate[],
  customChangepointsEnabled: false,
  forecasting: false,
  anchorEl: null,
  alerts: [] as IAlerts[],
  alertsLoading: false,
  alertingPreview: false,
  alertingPlotMode: false,
  ...forecastingInitialState,
  ...checkConnectionInitialState,
  alertResults: {} as {[key: string]: IAlertResults},
  connected: false,
  columnNames: [],
  datasetIsConfiged: false,
  connections: [] as IConnection[],
  connectionLoading: false,
  uploadDatasetError: false,
  isUserStudy: false,
};

const concatenateAndSortDistinctArrays = (array1: number[], array2: number[]) => {
  // Concatenate the two arrays
  const combinedArray = array1.concat(array2);
  // Create a new Set to store only distinct values
  const uniqueValues = new Set<number>(combinedArray);
  // Convert the Set back to an array
  const distinctArray = Array.from(uniqueValues);
  // Sort the distinct array numerically
  distinctArray.sort((a, b) => a - b);
  return distinctArray;
}

export const connector = createAsyncThunk('connector', async (dbConnector: {name: string, type: string, host: string, port: string, username: string, password: string, database: string}) => {
    const response = await axios.post(`api/database/connect`, dbConnector).then(res => res);
    return response;
});

export const disconnector = createAsyncThunk('disconnector', async (data: {}) => {
    const sessionId = JSON.parse(localStorage.getItem("sessionId"));
    const response = await axios.post(`api/database/disconnect`, null, {params : {sessionId}}).then(res => res);
    return response;
});

export const getSchemaMetadata = createAsyncThunk('getSchemaMetadata', async (data: {schema: string}) => {
  try {
    const sessionId = JSON.parse(localStorage.getItem("sessionId"));
    const response = await axios.get(`api/datasets/metadata/${data.schema}`, {params : {sessionId}}).then(res => res);
    return response;
  } catch (error) {
    throw new Error("Can't get database metadata");
  }
});

export const getUserStudySchemaMetadata = createAsyncThunk('getUserStudySchemaMetadata', async (data: {schema: string}) =>{
  try {
    const sessionId = JSON.parse(localStorage.getItem("sessionId"));
    const response = await axios.get(`api/user-study/metadata/${data.schema}`,  {params : {sessionId}}).then(res => res);
    return response;
  } catch (error) {
    throw new Error("Can't get database metadata");
  }
});

export const getColumnNames = createAsyncThunk('getColumnNames', async (data: { schema: string, id: string}) => {
  const sessionId = JSON.parse(localStorage.getItem("sessionId"));
  const response = await axios.get(`api/datasets/metadata/columns/${data.schema}/${data.id}`, {params : {sessionId}}).then(res => res);
  return response;  
});


export const updateSchemaInfoColumnNames = createAsyncThunk('updateSchemaInfoColumnNames', async (data: { schema: string, id: string, columns: {timeCol: string | null, idCol: string | null, valueCol: string | null,isConfiged: boolean}}) => {
  const { schema, id, columns } = data;
  const sessionId = JSON.parse(localStorage.getItem("sessionId"));
  const response = await axios.put(`api/datasets/metadata/columns/${schema}/${id}`,columns, {params: {sessionId}}).then(res => res);
  return response;
});

export const getDataset = createAsyncThunk('getDataset', async (data: { schema: string, id: string }) => {
  const { schema, id } = data;
  const sessionId = JSON.parse(localStorage.getItem("sessionId"));
  try {
    const response = await axios.get(`api/datasets/${schema}/${id}`, {params : {sessionId}}).then(res => res);
    return response;  
  } catch (error) {
    throw new Error("Error retrieving data.Please try again.");
  }
});

export const getDatasets = createAsyncThunk('getDatasets', async () => {
  const response = await axios.get(`api/datasets`).then(res => res);
  return response;
});

export const updateDataset = createAsyncThunk('updateDataset', async (data: {dataset: IDataset}) => {
  const response = await axios.put(`api/datasets`, data.dataset).then(res => res);
  return response;
})

export const getSampleFile = createAsyncThunk('getSampleFile', async (id: string) => {
  const sessionId = JSON.parse(localStorage.getItem("sessionId"));
  const response = await axios.get(`api/datasets/${id}/sample`, {params : {sessionId}}).then(res => res);
  return response;
});

export const getAlerts = createAsyncThunk('getAlerts', async (datasetId: String) => {
  const response = await axios.get(`api/alerts/${datasetId}`).then(res => res);
  return response;
});

export const saveAlert = createAsyncThunk('saveAlert', async (alertInfo: IAlerts) => {
  const response = await axios.post(`api/alerts/add`, alertInfo).then(res => res);
  return response;
});

export const editAlert = createAsyncThunk('editAlert', async (alertInfo: IAlerts) => {
  const response = await axios.post(`api/alerts/edit`, alertInfo).then(res => res);
  return response;
});

export const deleteAlert = createAsyncThunk('deleteAlert', async (info: {alertName: String, datasetId: String}) => {
  const {alertName, datasetId} = info;
  const response = await axios.post(`api/alerts/remove/${datasetId}/${alertName}`).then(res => res);
  return response;
});


export const saveConnection = createAsyncThunk('saveConnection', async(connectionInfo: IConnection) => {
  const response = await axios.post(`api/connector/add`, connectionInfo).then(res => res);
  return response;
});

export const getConnection = createAsyncThunk('getConnection', async(connectionName: string) => {
  const response = await axios.get(`api/connector/get/${connectionName}`).then(res => res);
  return response;
});

export const getAllConnections = createAsyncThunk('getAllConnections', async() => {
  const response = await axios.get(`api/connector/get`).then(res => res);
  return response;
})

export const deleteConnection = createAsyncThunk('deleteConnection', async(connectionName: String) => {
  const response = await axios.post(`api/connector/remove/${connectionName}`).then(res => res);
  return response;
});


export const updateQueryResults = createAsyncThunk(
  'updateQueryResults',
  async (data: {
    schema: string;
    id: string;
    from: number;
    to: number;
    viewPort: IViewPort;
    selectedMeasures: any[];
    filter?: {};
  }, {getState}) => {
    const { schema, id, from, to, viewPort, selectedMeasures, filter } = data;
    let query;
    const {visualizer} = getState() as RootState;
    const customSelectedMeasures = [];
    const sessionId = JSON.parse(localStorage.getItem("sessionId"));
    const accuracy = visualizer.accuracy;
    visualizer.customSelectedMeasures
      .forEach(customMeasure => customSelectedMeasures.push(customMeasure.measure1, customMeasure.measure2));
    let measures = concatenateAndSortDistinctArrays(selectedMeasures, customSelectedMeasures);
    from !== null && to !== null
      ? (query = {
          from,
          to,
          viewPort,
          accuracy,
          measures,
          filter: filter ? filter : null,
        } as IQuery)
      : (query = {});
    const response = await axios.post(`api/datasets/${schema}/${id}/query`, query, {params : {sessionId}}).then(res => res);
    return {id, response: response.data};
  }
);

export const updateM4QueryResults = createAsyncThunk(
  'updateM4QueryResults',
  async (data: {
    schema: string;
    id: string;
    from: number;
    to: number;
    viewPort: IViewPort;
    selectedMeasures: any[];
    filter?: {};
  }, {getState}) => {
    const { schema, id, from, to, viewPort, selectedMeasures, filter } = data;
    let query;
    const {visualizer} = getState() as RootState;
    const customSelectedMeasures = [];
    const accuracy = 1.0
    const sessionId = JSON.parse(localStorage.getItem("sessionId"));
    visualizer.customSelectedMeasures
      .forEach(customMeasure => customSelectedMeasures.push(customMeasure.measure1, customMeasure.measure2));
    let measures = concatenateAndSortDistinctArrays(selectedMeasures, customSelectedMeasures);
    from !== null && to !== null
      ? (query = {
          from,
          to,
          viewPort,
          accuracy,
          measures,
          filter: filter ? filter : null,
        } as IQuery)
      : (query = {});
    const response = await axios.post(`api/datasets/${schema}/${id}/query`,  query, {params : {sessionId}}).then(res => res);
    return {id, response: response.data};
  }
);


export const updateCompareQueryResults = createAsyncThunk(
  'updateCompareQueryResults',
  async (data: { schema: string, compare: {[key: number]: any[]}; from: number; to: number; viewPort: IViewPort; filter: {} }, {getState}) => {
    const {visualizer} = getState() as RootState;
    const accuracy = visualizer.accuracy;
    const sessionId = JSON.parse(localStorage.getItem("sessionId"));
    const { compare, from, to, viewPort, filter, schema } = data;
    const response = await Promise.all(
      Object.keys(compare).map(
      key => {
        const query = from !== null && to !== null ? {from, to, viewPort, accuracy, measures: compare[key], filter} : {range: null}
        return axios.post(`api/datasets/${schema}/${key}/query`,  query, {params : {sessionId}}).then(res => ({name: key, data: res.data.data}))
      }
    )).then(res => res.map(r => r));
    return response;
  }
);

export const resetCache = createAsyncThunk('resetCache', async (data: {schema: string, id: string}) => {
  const requestUrl = `api/datasets/resetCache/${data.schema}/${data.id}`;
  const response = await axios.post(requestUrl);
  return response.data;
});

export const applyChangepointDetection = createAsyncThunk(
  'applyChangepointDetection',
  async (data: { id: string; from: number; to: number }) => {
    const { id, from, to } = data;
    const response = await axios
      .post(`api/tools/changepoint_detection`, {
        id,
        range: { from, to } as ITimeRange,
      })
      .then(res => res);
    return response.data;
  }
);

export const applyForecasting = createAsyncThunk('applyForecasting', async (id: string) => {
  const requestUrl = `api/tools/forecasting/${id}`;
  const response = await axios.post(requestUrl);
  return response.data;
});




// Then, handle actions in your reducers:
const visualizer = createSlice({
  name: 'VisualizerState',
  initialState,
  reducers: {
    resetFetchData: () => initialState,
    updateSelectedMeasures(state, action) {
      state.selectedMeasures = action.payload.sort((a, b) => a - b);
    },
    updateCustomSelectedMeasures(state, action) {
      state.customSelectedMeasures = action.payload;
    },
    updateFrom(state, action) {
      state.from = action.payload;
    },
    updateTo(state, action) {
      state.to = action.payload;
    },
    updateResampleFreq(state, action) {
      state.resampleFreq = action.payload;
    },
    updateFilter(state, action) {
      state.filter = action.payload;
    },
    resetFilters(state) {
      state.filter = {};
    },
    updateChangeChart(state, action) {
      state.changeChart = action.payload;
    },
    updateDatasetChoice(state, action) {
      state.datasetChoice = action.payload;
    },
    updateDatasetMeasures(state, action) {
      state.dataset.measures = action.payload;
    },
    updateChartRef(state, action) {
      state.chartRef = action.payload;
    },
    updateCustomChangepoints(state, action) {
      state.customChangepoints = action.payload;
    },
    updateActiveTool(state, action) {
      state.activeTool = action.payload;
    },
    updateCompare(state, action) {
      state.compare = action.payload
    },
    updateData(state, action) {
      state.data = [...state.data, action.payload];
    },
    updateSecondaryData(state, action) {
      state.secondaryData = action.payload;
    },
    updateAnchorEl(state, action) {
      state.anchorEl = action.payload;
    },
    updateAlertResults(state, action) {
      state.alertResults = { ...action.payload };
    },
    updateViewPort(state, action) {
      state.viewPort = action.payload;
    },
    updateAccuracy(state, action) {
      state.accuracy = action.payload;
    },
    setShowDatePick(state, action) {
      state.showDatePick = action.payload;
    },
    setCompareData(state, action) {
      state.compareData = action.payload;
    },
    setComparePopover(state, action) {
      state.comparePopover = action.payload;
    },
    setSingleDateValue(state, action) {
      state.singleDateValue = action.payload;
    },
    setDateValues(state, action) {
      state.dateValues = action.payload;
    },
    setFixedWidth(state, action) {
      state.fixedWidth = action.payload;
    },
    setExpand(state, action) {
      state.expand = action.payload;
    },
    setAlertingPreview(state, action) {
      state.alertingPreview = action.payload;
    },
    setAlertingPlotMode(state, action) {
      state.alertingPlotMode = action.payload;
    },
    setOpenToolkit(state, action) {
      state.openToolkit = action.payload;
    },
    setChartType(state, action) {
      state.chartType = action.payload;
    },
    setErrorMessage(state, action) {
      state.errorMessage = action.payload;
    },
    setSelectedConnection(state, action) {
      state.selectedConnection = action.payload;
    },
    setAutoMLStartDate(state, action) {
      state.forecastingStartDate = action.payload;
    },
    setAutoMLEndDate(state, action) {
      state.forecastingEndDate = action.payload;
    },
    setForecastingDataSplit(state, action) {
      state.forecastingDataSplit = action.payload;
    },
    setDatasetIsConfiged(state, action) {
      state.datasetIsConfiged = action.payload
    },
    setConnented(state, action) {
      state.connected = action.payload;
    },
    toggleForecasting(state, action) {
      state.forecasting = action.payload;
    },
    toggleCustomChangepoints(state, action) {
      state.customChangepointsEnabled = action.payload;
    },
    toggleUserStudy(state, action) {
      state.isUserStudy = action.payload;
    },
    resetSchemaMeta(state) {
      state.schemaMeta = null;
      state.chartRef = null;
    },
    resetForecastingState(state) {
      // remove plotlines from chart when you disable forecasting
      state.chartRef.xAxis[0].removePlotLine('start');
      state.chartRef.xAxis[0].removePlotLine('end');
      return { ...state, ...forecastingInitialState };
    },
    resetChartValues(state) {
      state.queryResultsLoading = initialState.queryResultsLoading;
      state.m4QueryResultsLoading = initialState.m4QueryResultsLoading;
      state.queryResults = initialState.queryResults;
      state.m4QueryResults = initialState.m4QueryResults;
      state.data = initialState.data;
      state.m4Data = initialState.m4Data;
      state.from = initialState.from;
      state.to = initialState.to;
      state.compareData = initialState.compareData;
      state.compare = initialState.compare;
      state.chartRef = initialState.chartRef;
    },
    resetSampleFile(state) {
      state.sampleFile = [];
    },
    resetColumnNames(state) {
      state.columnNames = [];
    },
    resetDataset(state) {
      state.dataset = null;
    },
    resetUploadDatasetError(state) {
      state.uploadDatasetError = false;
    }
  },
  extraReducers: function (builder) {
    builder.addCase(getDataset.fulfilled, (state, action) => {
      state.loading = false;
      state.dataset = action.payload.data;
      state.datasetChoice = (state.schemaMeta && state.dataset) ? state.schemaMeta.data.findIndex(item => item.id === state.dataset.id) : 0;
      state.measureColors = [...state.dataset.header.map(() => generateColor())];
      state.resampleFreq = calculateFreqFromDiff(action.payload.data.timeRange);
      state.selectedMeasures = [action.payload.data.measures[0]];
    });
    builder.addCase(connector.fulfilled, (state, action) => {
      state.loading = false;
      state.connected = true;
      localStorage.setItem("sessionId", JSON.stringify(action.payload.data));
    });
    builder.addCase(disconnector.fulfilled, state => {
      state.loading = false;
      state.connected = false;
    });
    builder.addCase(getSchemaMetadata.fulfilled, (state, action) => {
      state.loading = false;
      state.schemaMeta = action.payload.data;
      state.datasetChoice = (state.schemaMeta && state.dataset) ? state.schemaMeta.data.findIndex(item => item.id === state.dataset.id) : 0;
    });
    builder.addCase(getUserStudySchemaMetadata.fulfilled, (state, action) => {
      state.loading = false;
      state.schemaMeta = action.payload.data;
      state.datasetChoice = (state.schemaMeta && state.dataset) ? state.schemaMeta.data.findIndex(item => item.id === state.dataset.id) : 0;
    });

    builder.addCase(updateSchemaInfoColumnNames.fulfilled, (state, action) => {
      state.loading = false;
      state.schemaMeta.data[state.datasetChoice] = action.payload.data;
    });

    builder.addCase(getColumnNames.fulfilled, (state, action) => {
      state.loading = false;
      state.columnNames = action.payload.data;
    });
    builder.addCase(updateDataset.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(getDatasets.fulfilled, (state, action) => {
      state.datasets = {data: action.payload.data, loading: false, error: null};
    });
    builder.addCase(getSampleFile.fulfilled, (state, action) => {
      state.loading = false;
      state.sampleFile = action.payload.data;
    });
    builder.addCase(getAlerts.fulfilled, (state, action) => {
      state.alertsLoading = false;
      state.alerts = action.payload.data;
    });
    builder.addCase(editAlert.fulfilled, (state, action) => {
      state.alertsLoading = false;
      state.alerts = action.payload.data;
    });
    builder.addCase(saveAlert.fulfilled, (state, action) => {
      state.alertsLoading = false;
      state.alerts = action.payload.data;
    });
    builder.addCase(deleteAlert.fulfilled, (state, action) => {
      state.alertsLoading = false;
      state.alerts = action.payload.data;
    });
    builder.addCase(saveConnection.fulfilled, (state, action) => {
      state.checkConnectionLoading = false;
    });
    builder.addCase(getConnection.fulfilled, (state, action) => {
      state.checkConnectionLoading = false;
      state.connections = action.payload.data;
    });
    builder.addCase(getAllConnections.fulfilled, (state, action) => {
      state.checkConnectionLoading = false;
      state.connections = action.payload.data;
    });
    builder.addCase(deleteConnection.fulfilled, (state, action) => {
      state.checkConnectionLoading = false;
      state.connections = action.payload.data;
    });
    builder.addCase(updateQueryResults.fulfilled, (state, action) => {
      state.queryResultsLoading = false;
      state.queryResultsCompleted = true;
      state.queryResults = action.payload.response;
      state.data = action.payload.response.data;
      state.from = action.payload.response.data[Object.keys(action.payload.response.data)[0]][0].timestamp;
      state.to = action.payload.response.data[Object.keys(action.payload.response.data)[0]][action.payload.response.data[Object.keys(action.payload.response.data)[0]].length - 1].timestamp;
    });
    builder.addCase(updateM4QueryResults.fulfilled, (state, action) => {
      state.m4QueryResultsLoading = false;
      state.m4QueryResults = action.payload.response;
      state.m4Data = action.payload.response.data;
    });
    builder.addCase(updateCompareQueryResults.fulfilled, (state, action) => {
      state.compareData = action.payload;
      state.queryResultsLoading = false;
    });
    builder.addCase(getDatasets.pending, state => {
      state.datasets = {data: [], loading: true, error: null}
    });
    builder.addCase(getDatasets.rejected, (state, action) => {
      state.datasets = {...state.datasets, loading: false, error: "there was an error loading the data"}
    });
    builder.addMatcher(isAnyOf(getDataset.pending, updateDataset.pending, getSampleFile.pending, getSchemaMetadata.pending, getUserStudySchemaMetadata.pending, updateSchemaInfoColumnNames.pending,getColumnNames.pending, connector.pending, disconnector.pending), state => {
      state.loading = true;
    });
    builder.addMatcher(isAnyOf(updateQueryResults.pending, updateCompareQueryResults.pending), state => {
      state.queryResultsLoading = true;
      state.queryResultsCompleted = false;
      state.errorMessage = null;
    });
    builder.addMatcher(isAnyOf(updateM4QueryResults.pending), state => {
      state.m4QueryResultsLoading = true;
      state.errorMessage = null;
    });
    builder.addMatcher(isAnyOf(saveAlert.pending, deleteAlert.pending, getAlerts.pending, editAlert.pending), state => {
      state.alertsLoading = true;
    });
    builder.addMatcher(isAnyOf(saveConnection.pending,getConnection.pending,getAllConnections.pending, deleteConnection.pending), state => {
      state.connectionLoading = true;
    });
    builder.addMatcher(
      isAnyOf( getSchemaMetadata.rejected, getUserStudySchemaMetadata.rejected, updateDataset.rejected, updateSchemaInfoColumnNames.rejected, getSampleFile.rejected, getColumnNames.rejected, disconnector.rejected),
      (state, action) => {
        state.loading = false;
        state.errorMessage = "unable to reach server";
      }
    );
    builder.addMatcher(
      isAnyOf(connector.rejected),
      (state, action) => {
        state.loading = false;
        state.errorMessage = "credentials error";
      }
    );
    builder.addMatcher(isAnyOf(getDataset.rejected), 
      (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
        state.uploadDatasetError = true;
        state.queryResultsLoading = false;
      }
    );
    builder.addMatcher(isAnyOf(updateQueryResults.rejected, updateM4QueryResults.rejected, updateCompareQueryResults.rejected), (state, action) => {
      state.queryResultsLoading = false;
      state.m4QueryResultsLoading = false;
      state.errorMessage = action.error.message;
    });
    builder.addMatcher(isAnyOf(saveAlert.rejected, deleteAlert.rejected, getAlerts.rejected, editAlert.rejected), (state, action) => {
      state.alertsLoading = false;
    });
    builder.addMatcher(isAnyOf(saveConnection.rejected, getConnection.rejected, getAllConnections.rejected, deleteConnection.rejected), state => {
      state.connectionLoading = false;
    });
  },
});

export const {
  toggleCustomChangepoints, toggleForecasting, toggleUserStudy,
  updateSelectedMeasures,updateCustomSelectedMeasures,updateFrom,updateTo,updateResampleFreq,updateFilter,
  updateChangeChart,updateDatasetChoice,updateDatasetMeasures,updateCustomChangepoints,updateChartRef, 
  updateSecondaryData,updateActiveTool,updateCompare,updateAnchorEl,updateData, updateAlertResults,
  updateViewPort, updateAccuracy,
  setForecastingDataSplit,
  setAutoMLStartDate,setAutoMLEndDate,setShowDatePick, setCompareData, setComparePopover,
  setSingleDateValue,setDateValues,setFixedWidth,setAlertingPlotMode,
  setExpand,setOpenToolkit,setChartType,setAlertingPreview, setSelectedConnection,
  setErrorMessage,setDatasetIsConfiged, setConnented,
  resetChartValues,resetFetchData,
  resetSampleFile,resetColumnNames, resetFilters,
  resetDataset, resetForecastingState,resetUploadDatasetError,resetSchemaMeta,
} = visualizer.actions;
export default visualizer.reducer;
