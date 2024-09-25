import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveIcon from '@mui/icons-material/Save';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckIcon from '@mui/icons-material/Check';
import { green, orange } from '@mui/material/colors';
import ModalWithChart from './forecasting-results-modal';
import Tooltip from '@mui/material/Tooltip';
import Popper from '@mui/material/Popper';
import { getProgress, saveModel } from 'app/modules/store/forecastingSlice';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Row = props => {
  const { name, status, setResultsModal, handleClick } = props;
  const { forecastingData } = useAppSelector(state => state.forecasting);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            disabled={!Object.hasOwn(forecastingData.results, name)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {name}
        </TableCell>
        <TableCell align="center">
          {/* <LinearProgressWithLabel value={row.progress} /> */}
          {status === 'waiting' ? (
            <MoreHorizIcon sx={{ color: orange[400] }} />
          ) : status === 'processing' ? (
            <CircularProgress size={20} />
          ) : (
            <CheckIcon sx={{ color: green[400] }} />
          )}
        </TableCell>
        <TableCell align="center">{status}</TableCell>
      </TableRow>
      {Object.hasOwn(forecastingData.results, name) && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Box sx={{ display: 'flex', columnGap: 3, alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    Evaluation Metrics
                  </Typography>
                  <Tooltip title="View results">
                    <IconButton
                      onClick={() => {
                        setResultsModal(name);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Model</TableCell>
                      <TableCell align="center">MAE</TableCell>
                      <TableCell align="center">MAPE</TableCell>
                      <TableCell align="center">MSE</TableCell>
                      <TableCell align="center">RMSE</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(forecastingData.results[name]).map(resultName => (
                      <TableRow key={resultName}>
                        <TableCell component="th" scope="row">
                          {resultName}
                        </TableCell>
                        <TableCell align="center">{forecastingData.results[name][resultName].evaluation['MAE']}</TableCell>
                        <TableCell align="center">{forecastingData.results[name][resultName].evaluation['MAPE']}</TableCell>
                        <TableCell align="center">{forecastingData.results[name][resultName].evaluation['MSE']}</TableCell>
                        <TableCell align="center">{forecastingData.results[name][resultName].evaluation['RMSE']}</TableCell>
                        <TableCell align="center">
                          <IconButton onClick={handleClick(resultName.split('_')[0], name)}>
                            <SaveIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const ForecastingResults = () => {
  const [resultsModal, setResultsModal] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const { forecastingData, savedModels } = useAppSelector(state => state.forecasting);
  const intervalID = useRef<number>(null);
  const [modelInfo, setmodelInfo] = useState({ model_name: '', model_type: '', target: '' });
  const [openSnack, setOpenSnack] = useState(false);

  const handleSnackOpen = () => {
    setOpenSnack(true);
  };

  const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  const handleClick = (type, target) => event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setmodelInfo({ ...modelInfo, model_type: type, target });
  };

  const handleTextChange = e => {
    setmodelInfo({ ...modelInfo, model_name: e.target.value });
  };

  const handleSubmit = e => {
    dispatch(saveModel(modelInfo));
    setAnchorEl(null);
    handleSnackOpen();
  };

  useEffect(() => {
    if (Object.values(forecastingData.status).some(el => el !== 'done') && Object.keys(forecastingData.status.length > 0)) {
      return;
    } else if (Object.keys(forecastingData.status.length > 0) && intervalID !== null) {
      clearInterval(intervalID.current);
    }
  }, [forecastingData]);

  useEffect(() => {
      intervalID.current =  setInterval(() => {
        dispatch(getProgress());
      }, 3000);
    return () => {
      clearInterval(intervalID.current);
    };
  }, []);

  return (
    <>
      <Snackbar open={openSnack} autoHideDuration={3000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
          Model has been saved
        </Alert>
      </Snackbar>
      <Popper id="save-popper" open={open} anchorEl={anchorEl} placement="top">
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper', display: 'flex' }}>
          <TextField id="outlined-required" size="small" label={null} onChange={handleTextChange} />
          <IconButton onClick={handleSubmit}>
            <CheckIcon />
          </IconButton>
        </Box>
      </Popper>
      <ModalWithChart resultsModal={resultsModal} forecastingData={forecastingData} setResultsModal={setResultsModal} />
      <Grid
        className={'Future-predictive-window'}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          rowGap: 2,
          textAlign: 'center',
        }}
      >
        <Grid
          sx={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid rgba(0,0,0,0.3)',
            columnGap: 2,
            width: '70%',
            m: 'auto',
          }}
        >
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Measure Name</TableCell>
                  <TableCell align="center">Progress</TableCell>
                  <TableCell align="center" />
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(forecastingData.status).map((key, idx) => (
                  <Row
                    key={key}
                    name={key}
                    status={forecastingData.status[key]}
                    setResultsModal={setResultsModal}
                    handleClick={handleClick}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default ForecastingResults;
