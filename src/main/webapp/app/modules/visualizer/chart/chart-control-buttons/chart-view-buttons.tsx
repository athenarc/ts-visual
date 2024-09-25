import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import grey from '@mui/material/colors/grey';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import { updateChangeChart } from 'app/modules/store/visualizerSlice';
import React from 'react';

const ChartView = () => {

    const dispatch = useAppDispatch();
    const {changeChart, data} = useAppSelector(state => state.visualizer);
    
    return (
        <Grid item sx={{alignSelf: "center"}}>
        <Button variant="outlined" size="small" disabled={data === null} onClick={() => {
          dispatch(updateChangeChart(false))
        }} sx={{mr: 1, color: changeChart ? "text.primary" : "primary", borderColor: changeChart ? grey[400] : "primary"}}>Overlay</Button>
        <Button variant="outlined" size='small' disabled={data === null} onClick={() => {
          dispatch(updateChangeChart(true))
        }} sx={{mr: 1, color: !changeChart ? "text.primary" : "primary", borderColor: !changeChart ? grey[400] : "primary"}}>Stacked</Button>
      </Grid>
    )
}

export default ChartView;