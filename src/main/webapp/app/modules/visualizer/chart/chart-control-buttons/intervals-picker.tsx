import React, { useEffect, useRef, useState} from 'react';
import EventNoteIcon from "@mui/icons-material/EventNote";
import HighlightAltIcon from '@mui/icons-material/HighlightAlt';
import FunctionsIcon from '@mui/icons-material/Functions';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import { setExpand, setFixedWidth, setShowDatePick } from 'app/modules/store/visualizerSlice';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';


//TODO: unused
export const IntervalsPicker = () => {

  const {expand, showDatePick, fixedWidth} = useAppSelector(state => state.visualizer);
  const dispatch = useAppDispatch();
  const ref = useRef(null);

  useEffect(() => {
    dispatch(setFixedWidth(ref.current.offsetWidth));
  }, []);

  const expanded = {
    backgroundColor: 'lightgrey',
    color: 'white',
  }
  return (
    <Box sx={{verticalAlign: "middle", textAlign: 'center', position: 'relative'}}>
      <Tooltip title="Pick Intervals">
        <Button ref={ref} variant="text" size="small"
                color={expand ? 'success' : 'primary'}
                style={expand ? expanded : null}
                onClick={() => {
                  dispatch(setExpand(!expand));
                }}><EventNoteIcon color='action'/></Button>
      </Tooltip>
      {expand &&
        <Box sx={{
          width: fixedWidth,
          display: 'flex',
          flexDirection: 'row',
          zIndex: 2, position: 'absolute'
        }}>
          <Tooltip title="Highlight Intervals">
            <Button variant="text" size="small">
              <HighlightAltIcon color='action'/></Button>
          </Tooltip>
          <Tooltip title="Pick Intervals">
            <Button variant="text" size="small" onClick={() => dispatch(setShowDatePick(true))}>
              <EventNoteIcon color='action'/></Button>
          </Tooltip>
          <Tooltip title="Use a Function">
            <Button variant="text" size="small">
              <FunctionsIcon color='action'/></Button>
          </Tooltip>
        </Box>}
      {/*{showDatePick && <ChartDatePicker />}*/}
    </Box>
  )
}

export default IntervalsPicker;
