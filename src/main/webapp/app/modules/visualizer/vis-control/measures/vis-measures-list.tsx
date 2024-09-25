import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import React from "react";


export interface IVisMeasuresListProps {
  width: string,
  onChange: any,
  options: any,
  disabled: boolean,
  value: string,
}
export const VisMeasuresList = (props: IVisMeasuresListProps) => {
  const {width, disabled, onChange, options, value} = props;
  return (
    <Autocomplete
      filterSelectedOptions
      id="combo-box-demo"
      options={options}
      value={value}
      disabled={disabled}
      blurOnSelect={true}
      sx={{ width: width }}
      onChange={onChange}
      size="small"
      renderInput={params => <TextField {...params} label={'Add Measure'} />}
    />
  );
};

export default VisMeasuresList;
