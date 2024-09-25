import React from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import IconButton from "@mui/material/IconButton";
import { useAppSelector } from 'app/modules/store/storeConfig';
import grey from '@mui/material/colors/grey';

const CustomMeasureButton = ({ onClick, disabled }) => {
  const { selectedMeasures, customSelectedMeasures, compare } = useAppSelector(state => state.visualizer);

  return (
    <IconButton
      color="primary"
      onClick={onClick}
      sx={{border: `1px solid ${grey[300]}`}}
      size="medium"
      disabled={disabled}>
      <TuneIcon/>
    </IconButton>
  );
};

export default CustomMeasureButton;
