import {Checkbox, FormControl, InputLabel, ListItemIcon, ListItemText, MenuItem, Select} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";

export interface IDimensionSelectorProps {
  dimensions: number[], // preselected dimensions
  setDimensions: Dispatch<SetStateAction<number[]>>,
  header: string[],
  measures: number[],
  disabled?: boolean,
  label?: string,
}


export const DimensionSelector = (props: IDimensionSelectorProps) => {
  const {dimensions, measures, header, disabled, label} = props;

  const changeColumns = (e) => {
    const val = e.target.value;
    if (val[val.length - 1] === "all") {
      props.setDimensions(dimensions.length === measures.length ? [] : measures);
      return;
    }
    props.setDimensions(val);
  }
  return (
    <FormControl fullWidth>
      {label && <InputLabel id="mutiple-select-label">{label}</InputLabel>}
      <Select
        labelId="mutiple-select-label"
        multiple
        disabled={disabled}
        value={dimensions}
        label="Choose Columns to be Included"
        onChange={changeColumns}
        renderValue={(selected) => selected.length === 0 ? "Choose Columns to be Included" : (selected.map(s => header[s])).join(", ")}
      >
        {measures.map((option) => (
          <MenuItem key={option} value={option}>
            <ListItemIcon>
              <Checkbox checked={dimensions.includes(option)}/>
            </ListItemIcon>
            <ListItemText primary={header[option]}/>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default DimensionSelector;
