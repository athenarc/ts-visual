import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getAthenaInference, getInference, setForecastingInference, setPredModalOpen, setSelectedModel } from 'app/modules/store/forecastingSlice';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import React, { useState } from 'react';
import { Typography } from '@mui/material';
import grey from '@mui/material/colors/grey';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 1,
  pb: 3,
};

const ForecastingPredModal = () => {
  const { predModalOpen, selectedModel, forecastingInference } = useAppSelector(state => state.forecasting);
  const { dataset } = useAppSelector(state => state.visualizer);
  const [userDate, setUserDate] = useState(null);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setPredModalOpen(false));
    dispatch(setSelectedModel(null));
    dispatch(setForecastingInference(null));
    setUserDate(null);
  };

  const handleDateChange = value => {
    // if(selectedModel === "min_power"){
    //   const date = new Date(value).getTime();
    // setUserDate(date);
    // }else{
    const userTimezoneOffset = value.getTimezoneOffset() * 60000;
    const date = new Date(value).getTime() + userTimezoneOffset;
    setUserDate(date);
    // }
  };

  const handleClick = () => {
    dispatch(getInference({ timestamp: userDate, model_name: selectedModel, kind: dataset.id }));
  };

  const handleAthenaForecasting = () => {
    dispatch(getAthenaInference({ timestamp: userDate, model_name: dataset.id }))
  }

  const getDateValue = date => {
      return date ? date - new Date(date).getTimezoneOffset() * 60000 : null
  };

  const generateChart = () => {
    return [
      {
        name: selectedModel === "min_power" ? "minimun power" : "Predicted Values",
        opposite: false,
        data: Object.entries(forecastingInference).map(([key, value]) => [parseInt(key) * 1000, value]),
        offset: 0,
      },
    ];
  };

  const options = {
    title: {
      text: 'Predicted Data',
    },
    series: forecastingInference ? generateChart() : null,
    xAxis: {
      ordinal: false,
      type: 'datetime',
    },
    rangeSelector: {
      enabled: false,
    },
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Modal open={predModalOpen} onClose={handleClose}>
          <Grid sx={{ ...style, rowGap: 2 }}>
            <Grid
              sx={{ height: '20%', display: 'flex', columnGap: 2, justifyContent: 'center', borderBottom: `1px solid ${grey[500]}`, pb: 2 }}
            >
              <DateTimePicker
                label={'Give a Date'}
                minDateTime={dataset.timeRange.from}
                maxDateTime={dataset.timeRange.to}
                renderInput={props => <TextField size="small" {...props} />}
                value={getDateValue(userDate)}
                views={['year','month','day','hours']}
                onChange={e => {}}
                onAccept={val => {
                  handleDateChange(val);
                }}
                inputFormat="dd/MM/yyyy hh:mm a"
              />
              <Button variant="contained" onClick={selectedModel === "min_power" ? handleAthenaForecasting : handleClick}>
                proceed
              </Button>
            </Grid>
            <Grid sx={{ height: '80%', px: 3 }}>
              {forecastingInference ? (
                <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />
              ) : (
                <Grid sx={{ p: 10 }}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Give a Date and hit the button to see the results
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Modal>
      </LocalizationProvider>
    </>
  );
};

export default ForecastingPredModal;
