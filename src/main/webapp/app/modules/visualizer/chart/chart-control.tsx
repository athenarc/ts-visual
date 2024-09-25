import React, { useEffect, useState } from 'react';
import {ChartCompare} from './chart-control-buttons/chart-compare';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import { ChartAlerting } from './chart-control-buttons/chart-alerting-button';
import ChartDatePicker from './chart-control-buttons/chart-datepicker';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import ChartView from './chart-control-buttons/chart-view-buttons';
import Typography from '@mui/material/Typography';
import { resetCache, updateAccuracy } from 'app/modules/store/visualizerSlice';
import { Button, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export const ChartControl = ({}) => {
  const [value, setValue] = useState<number>(95);
  const {datasetChoice, accuracy, isUserStudy, schemaMeta, dataset} = useAppSelector(state => state.visualizer);
  const dispatch = useAppDispatch();
  
  const handleChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
        setValue(newValue);
      }
  };

  const handleIncrement = () => {
    const newValue = Math.min(value + 0.5, 100);
    setValue(newValue);
    if (typeof newValue === 'number') {
      dispatch(updateAccuracy(newValue / 100));
    }
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - 0.5, 90);
    setValue(newValue);
    if (typeof newValue === 'number') {
      dispatch(updateAccuracy(newValue / 100));
    }
  };

  const handleCommitChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      dispatch(updateAccuracy(newValue / 100));
    }
  };

  useEffect(() => {
    setValue(accuracy * 100);
  },[datasetChoice]);

  return (
    <Grid container direction="row">
      <Grid item alignItems="center" sx={{display: "flex", flex: 1, flexDirection: "row", justifyContent: "flex-start", columnGap: 2}}>
          <ChartDatePicker />
          {!isUserStudy && 
            <>
              <ChartCompare />
              <ChartAlerting />
            </>
          }
          {isUserStudy && (
            <>
              <Box sx={{ width: '40%', margin: 'auto', display: 'flex', alignItems: 'left' }}>
                <Box sx={{ width: '40%', margin: 'auto', display: 'flex', alignItems: 'left' }}>
                  <Typography id="slidebar-label">
                    Min. Accuracy: {value}%
                  </Typography>
                </Box>
                <Box sx={{ width: '50%', margin: 'auto', display: 'flex', alignItems: 'left' }}>
                  <Button size="small" onClick={handleDecrement} variant="contained" color="primary" sx={{marginRight: '1em' }}>
                    -
                  </Button>
                  <Slider
                    value={value}
                    min={90}
                    step={0.5}
                    max={100}
                    onChange={handleChange}
                    onChangeCommitted={handleCommitChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="lidebar-label"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button size="small" onClick={handleIncrement} variant="contained" color="primary" sx={{marginLeft: '1em' }}>
                    +
                  </Button>
                </Box>
                {/* <Box >
                  <Button size="small" onClick={() => 
                    dispatch(resetCache({schema: schemaMeta.name, id:dataset.id}))}>
                    <Tooltip title="Reset Cache">
                      <RefreshIcon />
                    </Tooltip>
                  </Button>
                </Box> */}
              </Box>
          </>
          )}
      </Grid>
      {!isUserStudy && <ChartView /> }
  
    </Grid>
  );
};
