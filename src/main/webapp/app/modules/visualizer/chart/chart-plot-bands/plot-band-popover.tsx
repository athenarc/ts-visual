import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {IconButton} from "@mui/material";
import {IChangepointDate} from "app/shared/model/changepoint-date.model";
import {useAppDispatch} from "app/modules/store/storeConfig";


export interface IPlotBandPopoverProps {
  id: number,
  changepoints: IChangepointDate[],
  setChangepoints: any,
  closePopover: any,
}

export const PlotBandPopover = (props: IPlotBandPopoverProps) => {

  const dispatch = useAppDispatch();

  const handleDeletion = () => {
    let newChangepoints = [...props.changepoints];
    newChangepoints = newChangepoints.filter(changepoint => changepoint.id !== props.id);
    props.setChangepoints(newChangepoints);
    props.closePopover();
  }

  return (
    <IconButton
      size="small"
      onClick = {handleDeletion}>
      <DeleteIcon
        fontSize="inherit"/>
    </IconButton>
  );
}

export default PlotBandPopover;
