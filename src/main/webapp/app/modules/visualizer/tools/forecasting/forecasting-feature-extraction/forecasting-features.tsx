import React, { Dispatch, SetStateAction } from 'react';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import { useAppSelector } from 'app/modules/store/storeConfig';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { Theme, useTheme } from '@mui/material';
import { IForecastingForm } from 'app/shared/model/forecasting.model';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

interface IFeatures {
  forecastingForm: IForecastingForm;
  setForecastingForm: Dispatch<SetStateAction<IForecastingForm>>;
}

const Features = (props: IFeatures) => {
  const { forecastingForm, setForecastingForm } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { selectedMeasures, dataset } = useAppSelector(state => state.visualizer);
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = mez => event => {
    // dataset.header[mez]
    const {
      target: { value },
    } = event;
    setForecastingForm(state => ({
      ...state,
      features: {
        ...state.features,
        columnFeatures: state.features.columnFeatures.reduce((acc, curval) => {
          if (curval.columnName === dataset.header[mez]) {
            return [
              ...acc,
              {
                columnName: curval.columnName,
                features: event.target.value,
              },
            ];
          } else {
            return [...acc, curval];
          }
        }, []),
      },
    }));
  };

  return (
    <Grid sx={{ display: 'flex', flexDirection: 'column', rowGap: 2, width: '70%', textAlign: 'center', m: 'auto' }}>
      {selectedMeasures.map(mez => (
        <Grid key={`${mez}-selectedMes-pill`} sx={{ display: 'flex', alignItems: 'center', columnGap: 2 }}>
          <Grid
            sx={{
              width: '20%',
              backgroundColor: grey[300],
              display: 'flex',
              alignItems: 'center',
              borderRadius: 2,
              height: 'auto',
              justifyContent: 'center',
            }}
          >
            <Typography variant="subtitle1" fontSize={20} sx={{ p: 1 }}>
              {`${dataset.header[mez]}`}
            </Typography>
          </Grid>
          <Grid sx={{ width: '80%' }}>
            <FormControl sx={{ width: '100%' }}>
              {forecastingForm.features.columnFeatures.findIndex(cf => cf.columnName === dataset.header[mez]) !== -1 &&
              forecastingForm.features.columnFeatures[
                forecastingForm.features.columnFeatures.findIndex(cf => cf.columnName === dataset.header[mez])
              ].features.length === 0 ? (
                <InputLabel id="demo-multiple-chip-label">Select Features</InputLabel>
              ) : null}
              {forecastingForm.features.columnFeatures.findIndex(cf => cf.columnName === dataset.header[mez]) !== -1 && (
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  displayEmpty
                  value={
                    forecastingForm.features.columnFeatures[
                      forecastingForm.features.columnFeatures.findIndex(cf => cf.columnName === dataset.header[mez])
                    ].features
                  }
                  onChange={handleChange(mez)}
                  renderValue={selected => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map(value => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {dataset.header
                    .filter(h => dataset.header[mez] !== h && dataset.header[dataset.timeCol] !== h)
                    .map(name => (
                      <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                        {name}
                      </MenuItem>
                    ))}
                </Select>
              )}
            </FormControl>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default Features;
