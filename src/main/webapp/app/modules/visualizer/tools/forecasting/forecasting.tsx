import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import ForecastingTrainStepper from './forecasting-landing/forecasting-train-stepper';
import ForecastingModelSelection from './forecasting-landing/forecasting-model-selection';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import { getSavedModels } from 'app/modules/store/forecastingSlice';



const Forecasting = () => {
  const [newTrain, setNewTrain] = useState(false);
  const {savedModels} = useAppSelector(state => state.forecasting);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSavedModels());
  }, [])

  return (
    <Grid sx={{ width: '100%', height: '100%' }}>
      {!newTrain && savedModels && <ForecastingModelSelection savedModels={savedModels} setNewTrain={setNewTrain} />}
      {newTrain && <ForecastingTrainStepper setNewTrain={setNewTrain} />}
    </Grid>
  );
};

export default Forecasting;
