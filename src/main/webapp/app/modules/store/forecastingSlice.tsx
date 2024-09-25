import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { IForecastingForm } from 'app/shared/model/forecasting.model';
import { IForecastingData, IForecastingDataDefault, IForecastingResults } from 'app/shared/model/forecastingData.model';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const initialState = {
  forecastingLoading: false,
  forecastingData: IForecastingDataDefault as IForecastingData,
  forecastingError: null,
  forecastingInitialSeries: null,
  savedModels: null,
  forecastingInference: null,
  predModalOpen: false,
  selectedModel: null,
};

const resultsMaker = (state, payload: IForecastingResults) => {
  return { ...state, [payload.target]: payload.metrics };
};

const requestTargetsData = (response, getState, dispatch) => {
  Object.keys(response.data).forEach(key => {
    if (response.data[key] === 'done') {
      dispatch(getTarget(key));
    }
  });
};

export const startTraining = createAsyncThunk('startTraining', async (config: IForecastingForm, { getState, dispatch }) => {
  const state: any = getState();
  const sessionId = JSON.parse(localStorage.getItem("sessionId"));
  const id = uuidv4();
  localStorage.setItem('id', id);
  dispatch(setForecastingData({ ...state.forecasting.forecastingData, id: id }));
  const response = await axios
    .post(`api/forecasting/train`, {
      id,
      config: JSON.stringify(config),
    }, {
      params: {sessionId}
    })
    .then(res => res);
  dispatch(getProgress());
  return response.data;
});

export const getProgress = createAsyncThunk('getProgress', async (_, { getState, dispatch }) => {
  const id = localStorage.getItem('id');
  const response = await axios
    .post(`api/forecasting/progress`, {
      id,
    })
    .then(res => res);
  requestTargetsData(response.data, getState, dispatch);
  return response.data;
});

export const getTarget = createAsyncThunk('getTarget', async (name: string) => {
  const target = { name, id: localStorage.getItem('id') };
  const response = await axios.post(`api/forecasting/target`, target).then(res => res.data as IForecastingResults);
  return response;
});

export const saveModel = createAsyncThunk('saveModel', async (modelInfo: { model_type; model_name; target }) => {
  const response = await axios.post(`api/forecasting/save`, modelInfo).then(res => res.data);
  return response;
});

export const getSavedModels = createAsyncThunk('getSavedModels', async () => {
  const response = await axios.get(`api/forecasting/models`).then(res => res.data);
  return response;
});

export const deleteModelByName = createAsyncThunk('deleteModelByName', async (modelName: String) => {
  const response = await axios.delete(`api/forecasting/models/${modelName}`).then(res => res.data);
  return response;
});

export const getInference = createAsyncThunk('getInference', async (info: { timestamp: number; model_name: string; kind: string }) => {
  const sessionId = JSON.parse(localStorage.getItem("sessionId"));
  const response = await axios.post(`api/forecasting/inference`, info, {params: {sessionId}}).then(res => res.data);
  return response;
});

export const getAthenaInference = createAsyncThunk('getAthenaInference', async (info: { timestamp: number; model_name: string }) => {
  const infoList = {data_id: info.model_name, start_date: moment(info.timestamp).format('YYYY-MM-DD HH:mm:ss'), end_date: moment(info.timestamp).format('YYYY-MM-DD HH:mm:ss'), use_case_id: "forecasting" }
  const response = await axios.post(`api/forecasting/Athenainference`, infoList).then(res => res.data);
  return response;
});

export const getInitialSeries = createAsyncThunk(
  'getInitialSeries',
  async (data: { from; to; schema; id; measure }, { getState, dispatch }) => {
    const { from, to, schema, id, measure } = data;
    const state: any = getState();
    const sessionId = JSON.parse(localStorage.getItem("sessionId"));
    const query = {
      from,
      to,
      viewPort: {width: 1000, height: 600},
      measures: [state.visualizer.dataset.header.indexOf(measure)],
      filter: {},
    };
    const response = await axios.post(`api/datasets/${schema}/${id}/query`, query, {params: {sessionId}}).then(res => res);
    return response.data;
  }
);

const forecasting = createSlice({
  name: 'forecastingState',
  initialState,
  reducers: {
    setForecastingData(state, action) {
      state.forecastingData = action.payload;
    },
    setForecastingInitialSeries(state, action) {
      state.forecastingInitialSeries = action.payload;
    },
    setPredModalOpen(state, action) {
      state.predModalOpen = action.payload;
    },
    setSelectedModel(state, action) {
      state.selectedModel = action.payload;
    },
    setForecastingInference(state, action) {
      state.forecastingInference = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getAthenaInference.fulfilled, (state, action) => {
      state.forecastingLoading = false;
      state.forecastingInference = action.payload.results;
    });
    builder.addCase(getInference.fulfilled, (state, action) => {
      state.forecastingLoading = false;
      state.forecastingInference = action.payload.predictions;
    });
    builder.addCase(startTraining.fulfilled, (state, action) => {
      state.forecastingLoading = false;
    });
    builder.addCase(getInitialSeries.fulfilled, (state, action) => {
      state.forecastingLoading = false;
      state.forecastingInitialSeries = action.payload.data;
    });
    builder.addCase(getProgress.fulfilled, (state, action) => {
      state.forecastingLoading = false;
      state.forecastingData = { ...state.forecastingData, status: action.payload.data };
    });
    builder.addCase(getTarget.fulfilled, (state, action) => {
      state.forecastingLoading = false;
      state.forecastingData.results = resultsMaker(state.forecastingData.results, action.payload);
    });
    builder.addMatcher(isAnyOf(saveModel.fulfilled, getSavedModels.fulfilled, deleteModelByName.fulfilled), (state, action) => {
      state.forecastingLoading = false;
      state.savedModels = action.payload;
    });
    builder.addMatcher(
      isAnyOf(
        deleteModelByName.pending,
        startTraining.pending,
        getProgress.pending,
        getTarget.pending,
        getInitialSeries.pending,
        saveModel.pending,
        getInference.pending,
        getAthenaInference.pending
      ),
      state => {
        state.forecastingLoading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        deleteModelByName.rejected,
        startTraining.rejected,
        getProgress.rejected,
        getTarget.rejected,
        getInitialSeries.rejected,
        saveModel.rejected,
        getInference.rejected,
        getAthenaInference.rejected
      ),
      (state, action) => {
        state.forecastingError = action.payload;
        state.forecastingLoading = false;
      }
    );
  },
});

export const {
  setForecastingData,
  setForecastingInitialSeries,
  setPredModalOpen,
  setSelectedModel,
  setForecastingInference,
} = forecasting.actions;
export default forecasting.reducer;
