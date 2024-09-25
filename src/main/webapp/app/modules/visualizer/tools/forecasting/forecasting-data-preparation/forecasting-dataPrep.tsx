import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React, { Dispatch, SetStateAction } from 'react';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { IForecastingForm } from 'app/shared/model/forecasting.model';
import { setAutoMLEndDate, setAutoMLStartDate, setForecastingDataSplit } from 'app/modules/store/visualizerSlice';
import { grey } from '@mui/material/colors';


interface IForecastingDataPrep {
  forecastingForm: IForecastingForm;
  setForecastingForm: Dispatch<SetStateAction<IForecastingForm>>;
}

const ForecastingDataPrep = (props: IForecastingDataPrep) => {
  const dispatch = useAppDispatch();
  const { dataset } = useAppSelector(state => state.visualizer);
  const { forecastingForm, setForecastingForm } = props;

  const handleDates = e => value => {
    const userTimezoneOffset = value.getTimezoneOffset() * 60000;
    const date = new Date(value).getTime();
    e === 'start' &&
      (setForecastingForm(state => ({ ...state, startDate: date + userTimezoneOffset})),
      dispatch(setAutoMLStartDate(new Date(date + userTimezoneOffset).getTime())));
    e === 'end' &&
      (setForecastingForm(state => ({ ...state, endDate: date + userTimezoneOffset})),
      dispatch(setAutoMLEndDate(new Date(date + userTimezoneOffset).getTime())));
  };

  const handleDataSplit = e => {
    if(e.target.value[0] >= 60){
    setForecastingForm(state => ({
      ...state,
      dataSplit: [e.target.value[0], e.target.value[1] - e.target.value[0], 100 - e.target.value[1]],
    }));
  }
  };

  const handleTimeInterval = (e) => {
    setForecastingForm(state => ({...state, time_interval: e.target.value}));
  }

  const handleDataSplitCommit = (e, value) => {
    dispatch(setForecastingDataSplit(forecastingForm.dataSplit));
  };

  const getDateValue = (date) => {
    return date === null ? date : date - new Date(date).getTimezoneOffset() * 60000
  }

  const sliderSx = { 
    '& .MuiSlider-thumb': {
      height: 20,
      width: 20,
      backgroundColor: '#fff',
      border: `1px solid ${grey[700]}`,
      '&:hover': {
        boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
      }
    },
    '& .MuiSlider-track': {
      height: 3,
      background: "#ff0000",
      borderColor: "white"
    },
    "& .MuiSlider-mark": {
      background: "none"
    },
    '& .MuiSlider-rail': {
      background: `linear-gradient(to right, #00FF00 0% ${forecastingForm.dataSplit[0]}%, #ff0000 ${forecastingForm.dataSplit[0]}% ${forecastingForm.dataSplit[1]}%, #00FFFF ${forecastingForm.dataSplit[1]}% 100%)`,
      opacity: 1,
      height: 3,
    },
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid
          className={'basic-values'}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            rowGap: 2,
            textAlign: 'center',
          }}
        >
          <Grid sx={{ display: 'flex', gap: 1, justifyContent: 'space-evenly', alignItems: 'center', width: '70%', m: 'auto' }}>
          <Typography variant="subtitle1" fontSize={18}>
              Data Range Selection:
            </Typography>
            <DateTimePicker
              label={forecastingForm.startDate ? null : 'Start Date'}
              minDateTime={new Date(dataset.timeRange.from)}
              maxDateTime={forecastingForm.endDate ? forecastingForm.endDate : new Date(dataset.timeRange.to)}
              renderInput={props => <TextField size="small" {...props} />}
              value={getDateValue(forecastingForm.startDate)}
              onChange={e => {}}
              views={['year','month','day','hours']}
              onAccept={handleDates('start')}
              inputFormat="dd/MM/yyyy hh:mm a"
            />
            <Typography variant="subtitle1" fontSize={20} fontWeight={800}>
              -
            </Typography>
            <DateTimePicker
              label={forecastingForm.endDate ? null : 'End Date'}
              minDateTime={forecastingForm.startDate ? forecastingForm.startDate : new Date(dataset.timeRange.from)}
              maxDateTime={new Date(dataset.timeRange.to)}
              renderInput={props => <TextField size="small" {...props} />}
              value={getDateValue(forecastingForm.endDate)}
              onChange={e => {}}
              views={['year','month','day','hours']}
              onAccept={handleDates('end')}
              inputFormat="dd/MM/yyyy hh:mm a"
            />
          </Grid>
          <Grid sx={{display: 'flex', gap: 1, alignItems: 'center', width: '70%', m: 'auto'}}>
          <Grid sx={{ width: '30%', alignSelf: "flex-start" }}>
              <Typography variant="subtitle1" fontSize={18}>
                Time interval:
              </Typography>
            </Grid>
            <Grid sx={{ width: '70%' }}>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            size='small'
            value={forecastingForm.time_interval}
            label=""
            onChange={handleTimeInterval}
            >
            <MenuItem value={"15m"}>15m</MenuItem>
            <MenuItem value={"30m"}>30m</MenuItem>
            <MenuItem value={"1h"}>1h</MenuItem>
            <MenuItem value={"6h"}>6h</MenuItem>
          </Select>
            </Grid>
          </Grid>
          <Grid sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '70%', m: 'auto' }}>
            <Grid sx={{ width: '30%', alignSelf: "flex-start" }}>
              <Typography variant="subtitle1" fontSize={18}>
                Data Split:
              </Typography>
            </Grid>
            <Grid sx={{ width: '70%' }}>
              <Slider
                value={[forecastingForm.dataSplit[0], forecastingForm.dataSplit[0] + forecastingForm.dataSplit[1]]}
                disableSwap
                onChange={handleDataSplit}
                onChangeCommitted={handleDataSplitCommit}
                valueLabelDisplay={'auto'}
                marks={[
                  { label: `train ${forecastingForm.dataSplit[0]}%`, value: forecastingForm.dataSplit[0] / 2 },
                  {
                    label: forecastingForm.dataSplit[1] > 0 ? `validation  ${forecastingForm.dataSplit[1]}%` : null,
                    value: forecastingForm.dataSplit[0] + forecastingForm.dataSplit[1] / 2,
                  },
                  {
                    label: forecastingForm.dataSplit[2] > 0 ? `test ${forecastingForm.dataSplit[2]}%` : null,
                    value: forecastingForm.dataSplit[0] + forecastingForm.dataSplit[1] + forecastingForm.dataSplit[2] / 2,
                  }
                ]}
                sx={sliderSx}
              />
            </Grid>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </>
  );
};

export default ForecastingDataPrep;
