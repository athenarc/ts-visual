import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import { editAlert, getAlerts, saveAlert } from 'app/modules/store/visualizerSlice';
import React, { useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';

export interface IAlertAddEditProps {
  action: string;
  alertInfo: any;
}

const AlertAddEdit = (props: IAlertAddEditProps) => {
  const { dataset, measureColors, alerts, alertsLoading, data } = useAppSelector(state => state.visualizer);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [alertName, setAlertName] = useState(props.action === 'edit' && props.alertInfo ? props.alertInfo.name : '');
  const [measureSel, setMeasureSel] = useState(props.action === 'edit' && props.alertInfo ? props.alertInfo.measure : null);
  const [operationSel, setOperationSel] = useState(props.action === 'edit' && props.alertInfo ? props.alertInfo.operation : 'over');
  const [duration, setDuration] = useState(props.action === 'edit' && props.alertInfo ? props.alertInfo.duration : {number: 10, unit: "hour"});
  const [values, setValues] = useState(props.action === 'edit' && props.alertInfo ? props.alertInfo.values : { value1: '', value2: '' });
  const [color, setColor] = useState(props.action === 'edit' && props.alertInfo ? props.alertInfo.color : '#333333');
  const [severity, setSeverity] = useState(props.action === 'edit' && props.alertInfo ? props.alertInfo.severity : 1);
  const [colorOpen, setColorOpen] = useState(false);
  const [popperAnchor, setPopperAnchor] = useState(null);
  const [errorVals, setErrorVals] = useState(new Map());

  const resetEntries = () => {
    setAlertName('');
    setMeasureSel(null);
    setValues({ value1: '', value2: '' });
    setOperationSel('over');
    setDuration({number: 10, unit: "hour"});
  };

  // useEffect(() => {
  //   alertsLoading && dispatch(getAlerts(dataset.id));
  // }, [alertsLoading]);

  const checkIfErrorExists = (input, name) => {
    input !== '' &&
      errorVals.has(name) &&
      setErrorVals(prev => {
        const newState = new Map(prev);
        newState.delete(name);
        return newState;
      });
  };

  const handleColorChange = newColor => {
    setColor(newColor.hex);
  };

  const handleColorClick = event => {
    setPopperAnchor(event.currentTarget);
    setColorOpen(previousOpen => !previousOpen);
  };

  const handleSeverity = e => {
    setSeverity(e.target.value);
  };

  const checkIfNameExists = name => {
    let checker = false;
    for (let i = 0; i < alerts.length; i++) {
      if (alerts[i].name === name) {
        checker = true;
        break;
      } else {
        checker = false;
      }
    }
    return checker;
  };

  const handleErrors = (key, value) => {
    if (key === 'values') {
      const results = [];
      if (value.value1 === '') {
        results.push(['value1', 'Give Input']);
      } else {
        if (value.value1 > value.value2 && (operationSel === 'between' || operationSel === 'notBetween')) {
          results.push(['value1', 'First value should be lower than second']);
        } else {
          return null;
        }
      }
      if (value.value2 === '') {
        results.push(['value2', 'Give Input']);
      } else {
        if (value.value2 < value.value1 && (operationSel === 'between' || operationSel === 'notBetween')) {
          results.push(['value2', 'Second value should be higher than first']);
        } else {
          return null;
        }
      }
      return results;
    } else if (key !== 'values' && (value === '' || value === null)) {
      return [key, key === 'name' ? 'Must give a Name' : key === 'measure' ? 'Must choose a measure' : null];
    } else if (key === 'name' && value !== '') {
      if (props.action === 'add') {
        if (checkIfNameExists(value)) {
          return [key, 'Name already exists'];
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  const handleName = e => {
    setAlertName(e.target.value);
    checkIfErrorExists(e.target.value, 'name');
  };

  const handleMeasure = e => {
    e.target.innerText === '' ? setMeasureSel(null) : setMeasureSel(e.target.innerText);
    checkIfErrorExists(e.target.value, 'measure');
  };

  const handleOperation = e => {
    setOperationSel(e.target.value);
    setValues({ value1: '', value2: '' });
  };

  const handleDuration = valType => e => {
    switch(valType){
      case "number":
        setDuration(prev => ({...prev, number: parseFloat(e.target.value)}))
        break;
      case "unit":
        setDuration(prev => ({...prev, unit: e.target.value}))
        break;
    }
  };

  const handleValues = e => {
    setValues(prev => ({ ...prev, [e.target.id]: e.target.value }));
    checkIfErrorExists(e.target.value, e.target.id);
  };

  const handleSubmit = e => {
    const finalInput = {
      name: alertName,
      measure: measureSel,
      values: {
        value1: values.value1,
        value2: values.value2,
      },
      operation: operationSel,
      duration,
      dateCreated: new Date().getTime(),
      // dateCreated: props.action === 'edit' && props.alertInfo ? props.alertInfo.dateCreated : data[measureIndex][data[measureIndex].length - 1].timestamp,
      datasetId: dataset.id,
      color,
      severity,
      active: true,
    };
    const alertErrors = new Map();
    for (const [key, value] of Object.entries(finalInput)) {
      const entry = handleErrors(key, value);
      entry !== null && key === 'values' && entry.map(en => en !== null && alertErrors.set(en[0], en[1]));
      entry !== null && key !== 'values' && alertErrors.set(entry[0], entry[1]);
    }
    if (alertErrors.size === 0) {
      resetEntries();
      props.action === 'add' ? dispatch(saveAlert(finalInput)) : dispatch(editAlert(finalInput));
    } else {
      setErrorVals(new Map(alertErrors));
    }
  };

  return (
    <>
      {props.action === 'edit' && props.alertInfo === null ? (
        <>
          <Grid>
            <Typography id="modal-error-message" component={'span'} color={'#757575'} variant="subtitle1" fontSize={18}>
              Press {<EditIcon sx={{ verticalAlign: 'middle' }} />} in order to edit an Alert
            </Typography>
          </Grid>
        </>
      ) : (
        <>
          <Popper id="Color-Popper" open={colorOpen} anchorEl={popperAnchor} transition placement="right" sx={{ zIndex: 1500 }}>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Box sx={{ bgcolor: 'background.paper' }}>
                  <ChromePicker color={color} onChange={handleColorChange} />
                </Box>
              </Fade>
            )}
          </Popper>
          <Grid item xs={12} sx={{ textAlign: 'left', flex: 1, display: 'flex' }}>
            <Typography id="modal-modal-title" variant="h5" sx={{ alignSelf: 'center' }} component={'span'}>
              Alert Config
            </Typography>
            <Tooltip title="Save" placement="right">
              <IconButton
                aria-label="save"
                id="long-button"
                size="large"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleSubmit}
              >
                {props.action === 'add' ? <SaveIcon fontSize="large" /> : <SaveAsIcon fontSize="large" />}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Box sx={{ backgroundColor: '#eeeeee', pl: 2, pr: 3, pt: 1, pb: 1 }}>
              <Typography id="modal-modal-title" component={'span'} variant="subtitle1" fontSize={18}>
                Name
              </Typography>
            </Box>
            <Box sx={{ backgroundColor: '#f5f5f5', pl: 2, pr: 3, pt: 1, pb: 1, ml: 1 }}>
              <TextField
                required
                size="small"
                disabled={props.action === 'edit'}
                helperText={
                  (alertName.length > 8 ? 'Name must not exceed 8 characters' : null) ||
                  (errorVals.has('name') ? errorVals.get('name') : null)
                }
                error={alertName.length > 8 || (errorVals.has('name') && errorVals.get('name') !== null)}
                value={alertName}
                id="standard-required"
                variant="standard"
                sx={{ width: 'fit-content' }}
                onChange={handleName}
              />
            </Box>
            <Box sx={{ backgroundColor: '#eeeeee', pl: 2, pr: 3, pt: 1, pb: 1, ml: 1, mr: 1 }}>
              <Typography id="modal-modal-description" component={'span'} variant="subtitle1" fontSize={18}>
                Evaluate every
              </Typography>
            </Box>
            <TextField
                id="evaluate_number"
                label="Number"
                type="number"
                size="small"
                value={duration.value}
                sx={{ mr: 1, backgroundColor: '#f5f5f5', width: 100 }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleDuration("number")}
              />
            <FormControl size="small">
              <InputLabel id="demo-simple-select-label">Unit</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={duration.unit}
                label="Unit"
                variant="outlined"
                sx={{ backgroundColor: '#f5f5f5', width: 100 }}
                onChange={handleDuration("unit")}
              >
                <MenuItem value={"second"}>second</MenuItem>
                <MenuItem value={"minute"}>minute</MenuItem>
                <MenuItem value={"hour"}>hour</MenuItem>
                <MenuItem value={"day"}>day</MenuItem>
                <MenuItem value={"month"}>month</MenuItem>
                <MenuItem value={"year"}>year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Box sx={{ backgroundColor: '#eeeeee', pl: 2, pr: 3, pt: 1, pb: 1, mr: 1 }}>
              <Typography id="modal-modal-description" component={'span'} variant="subtitle1" fontSize={18}>
                Color
              </Typography>
            </Box>
            <Button sx={{ backgroundColor: '#f5f5f5', borderColor: '#eeeeee' }} variant="outlined" disableRipple onClick={handleColorClick}>
              <div
                style={{ backgroundColor: color, paddingRight: 20, paddingLeft: 20, color: 'transparent', paddingTop: 4, paddingBottom: 4 }}
              >
                .
              </div>
            </Button>
            <Box sx={{ backgroundColor: '#eeeeee', pl: 2, pr: 3, pt: 1, pb: 1, ml: 1, mr: 1 }}>
              <Typography id="modal-modal-description" component={'span'} variant="subtitle1" fontSize={18}>
                Severity
              </Typography>
            </Box>
            <FormControl size="small">
              <InputLabel id="demo-simple-select-label">Rank</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={severity}
                label="Duration"
                variant="outlined"
                sx={{ backgroundColor: '#f5f5f5' }}
                onChange={handleSeverity}
              >
                <MenuItem value={1}>low</MenuItem>
                <MenuItem value={2}>medium</MenuItem>
                <MenuItem value={3}>high</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'left', flex: 1, mt: 2 }}>
            <Typography id="modal-modal-title" variant="h5" component={'span'}>
              Condition
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', mt: 2, alignItems: 'center', width: '100%' }}>
            <Box sx={{ backgroundColor: '#eeeeee', pl: 2, pr: 3, pt: 1, pb: 1 }}>
              <Typography variant="subtitle1" component={'span'} fontSize={18} id="modal-modal-description">
                When
              </Typography>
            </Box>
            <Box sx={{ pl: 1, pr: 1, pt: 1, pb: 1 }}>
              <Autocomplete
                disableClearable={true}
                filterSelectedOptions
                id="combo-box-demo"
                options={dataset.header}
                value={measureSel}
                size="small"
                sx={{ width: 200, backgroundColor: '#f5f5f5' }}
                onChange={handleMeasure}
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    label={'Select Measure'}
                    error={errorVals.has('measure') && errorVals.get('measure') !== null}
                    helperText={errorVals.has('measure') ? errorVals.get('measure') : null}
                  />
                )}
              />
            </Box>
            <Box sx={{ backgroundColor: '#eeeeee', pl: 2, pr: 3, pt: 1, pb: 1, mr: 1 }}>
              <Typography variant="subtitle1" component={'span'} fontSize={18} id="modal-modal-description">
                Is
              </Typography>
            </Box>
            <FormControl size="small" sx={{ mr: 1 }}>
              <InputLabel id="demo-simple-select-label">Operation</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={operationSel}
                label="Operation"
                sx={{ backgroundColor: '#f5f5f5' }}
                onChange={handleOperation}
              >
                <MenuItem value={'over'}>Over</MenuItem>
                <MenuItem value={'under'}>Under</MenuItem>
                <MenuItem value={'between'}>Between</MenuItem>
                <MenuItem value={'notBetween'}>Not Between</MenuItem>
              </Select>
            </FormControl>
            {/* </Grid> */}
            {/* <Grid item xs={12} sx={{ display: 'flex', mt: 2, alignItems: 'center', width: '100%' }}> */}
            <Box sx={{ backgroundColor: '#eeeeee', pl: 2, pr: 3, pt: 1, pb: 1 }}>
              <Typography variant="subtitle1" component={'span'} fontSize={18} id="modal-modal-description">
                Value
              </Typography>
            </Box>
            {operationSel !== 'between' && operationSel !== 'notBetween' ? (
              <TextField
                id="value1"
                label="Number"
                type="number"
                size="small"
                error={errorVals.has('value1')}
                helperText={errorVals.has('value1') && errorVals.get('value1')}
                value={values ? values.value1 : ''}
                sx={{ ml: 1, backgroundColor: '#f5f5f5', width: 100 }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleValues}
              />
            ) : (
              <>
                <TextField
                  id="value1"
                  label="Number-1"
                  type="number"
                  size="small"
                  error={errorVals.has('value1')}
                  helperText={errorVals.has('value1') && errorVals.get('value1')}
                  value={values ? values.value1 : ''}
                  sx={{ ml: 1, mr: 1, backgroundColor: '#f5f5f5', width: 100 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleValues}
                />
                <Typography variant="h6" component={'span'} id="modal-modal-description" sx={{ mr: 1, ml: 1 }}>
                  -
                </Typography>
                <TextField
                  id="value2"
                  label="Number-2"
                  type="number"
                  size="small"
                  error={errorVals.has('value2')}
                  helperText={errorVals.has('value2') && errorVals.get('value2')}
                  value={values && values.value2 ? values.value2 : ''}
                  sx={{ ml: 1, mr: 1, backgroundColor: '#f5f5f5', width: 100 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleValues}
                />
              </>
            )}
          </Grid>
        </>
      )}
    </>
  );
};

export default AlertAddEdit;
