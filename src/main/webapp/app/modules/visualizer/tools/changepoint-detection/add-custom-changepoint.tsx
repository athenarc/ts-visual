import {Box, Button, Typography} from "@mui/material";
import React from "react";
import {toggleCustomChangepoints} from "app/modules/store/visualizerSlice";
import {useAppDispatch, useAppSelector} from "app/modules/store/storeConfig";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export interface AddCustomChangepointProps {
  check: boolean,
  name: string,
  handleFunction: any,
}
export const AddCustomChangepoint = (props:AddCustomChangepointProps) => {
  const {anchorEl} = useAppSelector(state => state.visualizer);
  const dispatch = useAppDispatch();
  const {check, name, handleFunction} = props;


  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    }}>
      <Box sx={{pt: 1}}>
        <Typography variant="body1">{name}</Typography>
      </Box>
      <Button
        onClick={() => handleFunction()}
      >
        {(check && anchorEl === null)
          ?  <HighlightOffIcon /> : <AddCircleOutlineIcon color={"primary"}/>
        }
      </Button>
    </Box>
  );
}
