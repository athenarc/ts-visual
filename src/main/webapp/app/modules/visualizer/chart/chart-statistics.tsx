import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import {MeasureSelection} from "app/shared/layout/MeasureSelection";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

//TODO: unused
export const ChartStatistics = () => {

  const {} = useAppSelector(state => state.visualizer);
  const dispatch = useAppDispatch();

  return (
      <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'left',
            alignItems: 'left',
            p: 1}}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'left',
            alignItems: 'left',
            p: 1}}
        >
          <Typography variant="body1" gutterBottom sx={{fontWeight: 600}}>
            Statistics For
          </Typography>
          <MeasureSelection label={"Field"}/>
        </Box>
      {/**/}
      </Box>

  );
};

export default ChartStatistics;
