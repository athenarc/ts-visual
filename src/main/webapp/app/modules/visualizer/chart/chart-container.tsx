import React from 'react';
import Chart from './chart';
import { ChartControl } from './chart-control';
import { useAppSelector } from 'app/modules/store/storeConfig';
import Grid from '@mui/material/Grid';
import ChartToolsWindow from './chart-tools-window';

export const ChartContainer = ({}) => {
  const { activeTool, schemaMeta, dataset } = useAppSelector(state => state.visualizer);

  return (
    <Grid sx={{ display: 'flex', flexDirection: 'column', height: "100%" }}>
      <Grid sx={{height: "50px", width: "100%"}}>
      <ChartControl/>
      </Grid>
      <Grid sx={{height: "calc(100% - 50px)", width: "100%"}}>
      <Chart />
      {activeTool && (
        <ChartToolsWindow />
      )}
      </Grid>
    </Grid>
  );
};
