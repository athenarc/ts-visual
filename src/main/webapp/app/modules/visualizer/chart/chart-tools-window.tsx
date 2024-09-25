import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import Filter from '../tools/filter/filter';
import Forecasting from '../tools/forecasting/forecasting';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import { resetForecastingState, updateActiveTool } from 'app/modules/store/visualizerSlice';
import grey from '@mui/material/colors/grey';
import red from '@mui/material/colors/red';
import IconButton from '@mui/material/IconButton';

const ChartToolsWindow = () => {
  const { activeTool } = useAppSelector(state => state.visualizer);
  const dispatch = useAppDispatch();

  const handleClose = e => {
    dispatch(updateActiveTool(null))
    dispatch(resetForecastingState());
  };

  return (
    <Grid sx={{ height: '60%', pt: 2 }}>
      <Paper elevation={1} sx={{ border: '1px solid rgba(0,0,0, 0.1)', height: '100%' }}>
        <Grid sx={{ height: 'fit-content', textAlign: 'left', display: "flex", bgcolor: grey[300] }}>
          <Typography variant="subtitle1" fontSize={25} fontWeight={500} sx={{ color: grey[600], pl: 1, pr: 1 }}>
            {activeTool}
          </Typography>
          <Box sx={{flex: 1}}/>
          <IconButton onClick={handleClose} sx={{borderRadius: 0, "&:hover": {color: red[400]}}}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid sx={{ height: '90%' }}>

          {activeTool === 'Forecasting' && <Forecasting />}
          {activeTool === 'Filtering' && <Filter />}
        </Grid>
      </Paper>
    </Grid>
  );
};

export default ChartToolsWindow;
