import {createSlice } from '@reduxjs/toolkit';
import {ParseResult} from 'papaparse';

const initialState = {
    csvSample: {} as ParseResult,
    files: null,
    metaData: null
};

const uploadSchema = createSlice({
  name: 'uploadSchema',
  initialState,
  reducers: {
    setCsvSample(state, action){
      state.csvSample = action.payload
    },
    setFiles(state, action) {
        state.files = Array.prototype.slice.call(action.payload)
    },
    setMetaData(state, action) {
        state.metaData = action.payload
    }
  },
  extraReducers(builder) {},
});

export const {setCsvSample, setFiles, setMetaData} = uploadSchema.actions;
export default uploadSchema.reducer;
