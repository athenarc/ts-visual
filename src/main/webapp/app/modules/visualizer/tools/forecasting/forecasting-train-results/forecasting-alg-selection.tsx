import Grid from '@mui/material/Grid';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Typography from '@mui/material/Typography';
import {
  IForecastingForm,
  ILGBMDefault,
  ILGBMDefaultFT,
  ILinearRegressionDefault,
  IXGBoostDefault,
  IXGBoostDefaultFT,
} from 'app/shared/model/forecasting.model';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import ForecastingAlgModal from './forecasting-alg-selection-modal';
import Slider from '@mui/material/Slider';

interface IForecastingTrain {
  forecastingForm: IForecastingForm;
  setForecastingForm: Dispatch<SetStateAction<IForecastingForm>>;
}

const ForecastingAlgSelection = (props: IForecastingTrain) => {
  const { forecastingForm, setForecastingForm } = props;
  const [open, setOpen] = useState(false);
  const [fineTuneSelection, setFileTuneSelection] = useState([]);
  const [selectedAlgo, setSelectedAlgo] = useState(null);

  const handleConfigClick = algName => e => {
    setSelectedAlgo(algName);
    setOpen(!open);
  };

  const handleSliderChange = (e,val) => {
    setForecastingForm(state => ({...state, future_predictions: val}))
  }

  const handleFineTuneCheckbox = algName => e => {
    const tempForm = forecastingForm;
    if (e.target.checked) {
      setFileTuneSelection(state => [...state, algName]);
    } else {
      setFileTuneSelection(fineTuneSelection.filter(n => n !== algName));
    }
    if (algName === 'XGBoost') {
      if (e.target.checked) {
        setForecastingForm(state => ({ ...state, algorithms: { ...state.algorithms, XGBoost: IXGBoostDefaultFT } }));
      } else {
        delete tempForm.algorithms['XGBoost'];
        setForecastingForm(state => ({ ...state, algorithms: { ...state.algorithms, XGBoost: IXGBoostDefault } }));
      }
    } else if (algName === 'LGBM') {
      if (e.target.checked) {
        setForecastingForm(state => ({ ...state, algorithms: { ...state.algorithms, LGBM: ILGBMDefaultFT } }));
      } else {
        delete tempForm.algorithms['LGBM'];
        setForecastingForm(state => ({ ...state, algorithms: { ...state.algorithms, LGBM: ILGBMDefault } }));
      }
    }
  };

  const handleAlgorithmSelection = algName => e => {
    const tempForm = forecastingForm;
    if (algName === 'XGBoost') {
      if (e.target.checked) {
        setForecastingForm(state => ({ ...state, algorithms: { ...state.algorithms, XGBoost: IXGBoostDefault } }));
      } else {
        delete tempForm.algorithms['XGBoost'];
        setForecastingForm(state => ({ ...state, algorithms: tempForm.algorithms }));
      }
    } else if (algName === 'LGBM') {
      if (e.target.checked) {
        setForecastingForm(state => ({ ...state, algorithms: { ...state.algorithms, LGBM: ILGBMDefault } }));
      } else {
        delete tempForm.algorithms['LGBM'];
        setForecastingForm(state => ({ ...state, algorithms: tempForm.algorithms }));
      }
    } else if (algName === 'LinearRegression') {
      if (e.target.checked) {
        setForecastingForm(state => ({ ...state, algorithms: { ...state.algorithms, LinearRegression: ILinearRegressionDefault } }));
      } else {
        delete tempForm.algorithms['LinearRegression'];
        setForecastingForm(state => ({ ...state, algorithms: tempForm.algorithms }));
      }
    }
  };

  return (
    <>
      <ForecastingAlgModal
        open={open}
        setOpen={setOpen}
        forecastingForm={forecastingForm}
        setForecastingForm={setForecastingForm}
        selectedAlgo={selectedAlgo}
        fineTuneSelection={fineTuneSelection}
        setFileTuneSelection={setFileTuneSelection}
      />
      <Grid
        className={'Future-predictive-window'}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          rowGap: 4,
          textAlign: 'center',
        }}
      >
        <Grid sx={{ width: '90%', borderBottom: '1px solid rgba(0,0,0,0.3)', m: 'auto' }}>
          <Typography variant="subtitle1" fontSize={20}>
            {`Algorithm Selection & Configuration`}
          </Typography>
        </Grid>
        <Grid sx={{ width: '60%', m: 'auto' }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
              <caption style={{width: "90%"}}>
                <div style={{width: "90%", display: "flex", columnGap: 15, alignItems: "center"}}>
                <Typography variant="subtitle1" fontSize={14}>
                Future Predictions:
              </Typography>
              <Slider sx={{width: "60%"}} disabled={false} marks={false} max={30} min={1} value={forecastingForm.future_predictions} size="small" valueLabelDisplay="auto" onChange={handleSliderChange} />
                </div>
              </caption>
              <TableHead>
                <TableRow>
                  <TableCell>Algorithm</TableCell>
                  <TableCell align="center">Parameters</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['XGBoost', 'LGBM', 'LinearRegression'].map(row => (
                  <TableRow key={row} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      <Checkbox checked={Object.hasOwn(forecastingForm.algorithms, row)} onChange={handleAlgorithmSelection(row)} />
                      {row}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        disabled={!Object.keys(forecastingForm.algorithms).includes(row)}
                        onClick={handleConfigClick(row)}
                      >
                        Configure
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default ForecastingAlgSelection;
