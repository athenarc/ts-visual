import Grid from '@mui/material/Grid';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import { IForecastingDefault, IForecastingForm } from 'app/shared/model/forecasting.model';
import React, { useEffect, useState } from 'react';
import ForecastingDataPrep from '../forecasting-data-preparation/forecasting-dataPrep';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ForecastingFeatureExtr from '../forecasting-feature-extraction/forecasting-feature-extraction';
import ForecastingAlgSelection from '../forecasting-train-results/forecasting-alg-selection';
import ForecastingResults from '../forecasting-results/forecasting-results';
import { startTraining } from 'app/modules/store/forecastingSlice';
import { resetForecastingState } from 'app/modules/store/visualizerSlice';

const steps = ['Data Selection', 'Feature Selection', 'Algorithm Selection'];

const ForecastingTrainStepper = props => {
  const { setNewTrain } = props;
  const { selectedMeasures, dataset } = useAppSelector(state => state.visualizer);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [forecastingForm, setForecastingForm] = useState<IForecastingForm>(IForecastingDefault);
  const dispatch = useAppDispatch();

  const handleTrain = e => {
    dispatch(startTraining(forecastingForm));
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  useEffect(() => {
    const columnFeat = forecastingForm.features.columnFeatures.map(num => num.columnName);
    const selMeasures = selectedMeasures.map(mez => dataset.header[mez]);
    setForecastingForm(state => ({
      ...state,
      kind: dataset.id,
      targetColumn: selectedMeasures.map(mez => dataset.header[mez]),
      features: {
        ...state.features,
        columnFeatures: selMeasures.reduce((acc, curval) => {
          if (columnFeat.includes(curval)) {
            return [
              ...acc,
              forecastingForm.features.columnFeatures[forecastingForm.features.columnFeatures.findIndex(cf => cf.columnName === curval)],
            ];
          } else {
            return [...acc, { columnName: curval, features: [] }];
          }
        }, []),
      },
    }));
  }, [selectedMeasures]);

  const isStepOptional = step => {
    return step === 1;
  };

  const isStepSkipped = step => {
    return skipped.has(step);
  };

  const handleNextButton = () => {
    if (activeStep === 0) {
      if (forecastingForm.startDate !== null && forecastingForm.endDate !== null) {
        return false;
      } else {
        return true;
      }
    } else if (activeStep === 1) {
      if (forecastingForm.features.columnFeatures[0].features.length !== 0) {
        return false;
      } else {
        return true;
      }
    } else if (activeStep === 2) {
      if (Object.keys(forecastingForm.algorithms).length !== 0) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setNewTrain(false);
    setActiveStep(0);
    dispatch(resetForecastingState());
  };

  return (
    <>
      <Grid sx={{ width: '100%', height: '15%' }}>
        <Stepper activeStep={activeStep} sx={{ pl: 3, pr: 3, pt: 2 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>
      <Grid sx={{ width: '100%', height: '70%', overflowY: 'auto', display: 'flex' }}>
        {activeStep === 0 ? (
          <ForecastingDataPrep forecastingForm={forecastingForm} setForecastingForm={setForecastingForm} />
        ) : activeStep === 1 ? (
          <ForecastingFeatureExtr forecastingForm={forecastingForm} setForecastingForm={setForecastingForm} />
        ) : activeStep === 2 ? (
          <ForecastingAlgSelection forecastingForm={forecastingForm} setForecastingForm={setForecastingForm} />
        ) : (
          <ForecastingResults />
        )}
      </Grid>
      {activeStep === 3 ? (
        <Grid sx={{ display: 'flex', flexDirection: 'row', height: '15%', pr: 3, pl: 3 }}>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button size="small" color="inherit" sx={{ fontSize: 12, height: '90%' }} onClick={handleReset}>
            Reset
          </Button>
        </Grid>
      ) : (
        <Grid sx={{ display: 'flex', flexDirection: 'row', height: '15%', pr: 3, pl: 3 }}>
          <Button size="small" color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ fontSize: 12, height: '90%' }}>
            Back
          </Button>
          <Grid sx={{ flex: '1 1 auto' }} />
          <Button
            size="small"
            sx={{ fontSize: 12, height: '90%' }}
            onClick={activeStep === steps.length - 1 ? handleTrain : handleNext}
            disabled={handleNextButton()}
          >
            {activeStep === steps.length - 1 ? 'Train' : 'Next'}
          </Button>
        </Grid>
      )}
    </>
  );
};

export default ForecastingTrainStepper;
