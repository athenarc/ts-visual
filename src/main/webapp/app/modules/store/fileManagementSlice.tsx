import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadDataset = createAsyncThunk('uploadDataset', async (fileData: FormData, { getState, dispatch }) => {
  const response = await axios
    .post(`api/files/upload/dataset`, fileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        dispatch(setUploadState(progress));
      },
      onDownloadProgress: (progressEvent) => {
        const percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        dispatch(setUploadState(percentage))
        if (percentage === 100 || percentage === Infinity) {
            dispatch(setUploadState(100));
            setTimeout(() => {
            dispatch(setUploadState(0));
            dispatch(setLoadingButton(false));
          }, 1000);
        }
      },
    })
    .then(res => res);
  return response;
});

export const uploadFile = createAsyncThunk('uploadFile', async (data: {schemaName: String, fileData: FormData}, { getState, dispatch }) => {
  const {schemaName, fileData} = data;
  const response = await axios
    .post(`api/files/upload/${schemaName}`, fileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        dispatch(setUploadState(progress));
      },
      onDownloadProgress: (progressEvent) => {
        const percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        dispatch(setUploadState(percentage))
        if (percentage === 100 || percentage === Infinity) {
            dispatch(setUploadState(100));
            setTimeout(() => {
            dispatch(setUploadState(0));
            dispatch(setLoadingButton(false));
          }, 1000);
        }
      },
    })
    .then(res => res);
  return response;
});

export const uploadSchema = createAsyncThunk('uploadSchema', async (data: FormData, { getState, dispatch }) => {
  const response = await axios
    .post(`api/files/upload/schema`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        dispatch(setUploadSchemaState(progress));
      },
      onDownloadProgress: (progressEvent) => {
        const percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        dispatch(setUploadSchemaState(percentage))
        if (percentage === 100 || percentage === Infinity) {
            dispatch(setUploadSchemaState(100));
            setTimeout(() => {
            dispatch(setUploadSchemaState(0));
            dispatch(setLoadingSchemaUpload(false));
          }, 1000);
        }
      },
    })
    .then(res => res);
  return response;
});

const initialState = {
    answer: null,
    uploadState: 0,
    uploadSchemaState: 0,
    loadingButton: false,
    uploadLoading: false,
    saveSchemaAnswer: null,
    saveDatasetAnswer: null,
    loadingSchemaUpload: false
};

const fileManagement = createSlice({
  name: 'fileManagementState',
  initialState,
  reducers: {
    setUploadState(state, action){
      state.uploadState = action.payload
    },
    setUploadSchemaState(state, action){
      state.uploadSchemaState = action.payload
    },
    setLoadingSchemaUpload(state, action){
      state.loadingSchemaUpload = action.payload
    },
    setLoadingButton(state, action){
      state.loadingButton = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(uploadDataset.fulfilled, (state, action) => {
        state.saveDatasetAnswer = action.payload;
        state.uploadLoading = false;
    });
    builder.addCase(uploadFile.fulfilled, (state, action) => {
        state.answer = action.payload.data;
        state.uploadLoading = false;
    });
    builder.addCase(uploadSchema.fulfilled, (state, action) => {
        state.saveSchemaAnswer = action.payload.data;
        state.uploadLoading = false;
    });
    builder.addMatcher(isAnyOf(uploadFile.pending, uploadSchema.pending, uploadDataset.pending), (state) => {
        state.uploadLoading = true;
    });
    builder.addMatcher(isAnyOf(uploadFile.rejected, uploadSchema.rejected, uploadDataset.rejected), (state) => {
        state.uploadLoading = false;
        state.answer = "Error occured";
    });
  },
});

export const {setUploadState, setLoadingButton, setLoadingSchemaUpload, setUploadSchemaState} = fileManagement.actions;
export default fileManagement.reducer;
