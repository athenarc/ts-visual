import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {setChartType} from "app/modules/store/visualizerSlice";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';


export const ChartType = () => {
  const { chartType } = useAppSelector(state => state.visualizer);
  const dispatch = useAppDispatch();

  const handleTypeChange = (event, newVal) => {
    if (newVal !== null) {
      dispatch(setChartType(newVal))
    }
  };
  return (
    <>
      <ToggleButtonGroup value={chartType} exclusive onChange={(e, newVal) => handleTypeChange(e, newVal)} aria-label="text alignment">
        <ToggleButton value="line" aria-label="left aligned">
          <ShowChartIcon />
        </ToggleButton>
        <ToggleButton value="boxplot" aria-label="centered">
          <CandlestickChartIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};
