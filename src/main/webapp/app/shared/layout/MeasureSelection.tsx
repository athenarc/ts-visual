import React, {useState} from "react";
import {useAppSelector} from "app/modules/store/storeConfig";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";


export interface IMeasureSeletionProps {
  label: string,

}
export const MeasureSelection = (props: IMeasureSeletionProps) => {
  const {dataset, selectedMeasures} = useAppSelector(state => state.visualizer);

  const {label} = props;
  const [measure, setMeasure] = useState();

  const handleChange = (e) => {
    setMeasure(e.target.value);
  }

  return (
    <Box>
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={measure}
          onChange={handleChange}
          label="Age"
        >
          {selectedMeasures.map((measure, idx) => <MenuItem value={idx}>{dataset.header[measure]}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  );
}
