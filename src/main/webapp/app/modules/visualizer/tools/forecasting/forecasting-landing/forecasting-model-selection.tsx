import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import { deleteModelByName, setPredModalOpen, setSelectedModel } from 'app/modules/store/forecastingSlice';
import ForecastingPredModal from '../forecasting-prediction/forecasting-prediction-modal';
import grey from '@mui/material/colors/grey';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const ForecastingModelSelection = props => {
  const { setNewTrain, savedModels } = props;
  const {dataset} = useAppSelector(state => state.visualizer);
  const dispatch = useAppDispatch();

  const handleNewTrain = () => {
    setNewTrain(true);
  };

  const handleDelete = modelName => e => {
    dispatch(deleteModelByName(modelName));
  };

  const handleInference = modelName => e => {
    dispatch(setPredModalOpen(true));
    dispatch(setSelectedModel(modelName));
  };

  return (
    <>
      <ForecastingPredModal />
      <Grid sx={{ height: '100%', width: '100%', scroll: 'auto', display: 'flex', flexDirection: 'column', rowGap: 2, fontSize: '2em' }}>
        <Grid
          sx={{
            width: '80%',
            height: '20%',
            borderBottom: '1px solid rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'end',
            textAlign: 'left',
            m: 'auto',
            pb: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'block', width: '100%', color: grey[800], alignSelf: 'end' }}>
            Saved Models
          </Typography>
          <Box sx={{ display: 'flex', columnGap: 0.3 }}>
            <Chip
              size="small"
              label="Train a new model"
              onClick={handleNewTrain}
              sx={{ bgcolor: grey[800], color: grey[50], p: 1, '&:hover': { color: grey[900], fontWeight: 500 } }}
            />
          </Box>
        </Grid>
        <Grid
          sx={{
            width: '80%',
            height: '80%',
            textAlign: 'center',
            m: 'auto',
            rowGap: 1,
            display: 'flex',
            flexDirection: 'column',
            pb: 4,
            pr: 1,
            pl: 1,
            overflowY: 'auto',
          }}
        >
          <TableContainer sx={{ maxheight: '80%' }} component={Paper}>
            <Table stickyHeader aria-label="caption table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Model Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedModels.map(model => (
                  <TableRow key={model.model_name}>
                    <TableCell component="th" scope="row">
                      {model.model_name}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={model.kind === dataset.id ? "Predict" : `This model was trained for ${model.kind} dataset`}>
                        <span>
                        <IconButton onClick={handleInference(model.model_name)} disabled={model.kind !== dataset.id}>
                          <QueryStatsIcon />
                        </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={handleDelete(model.model_name)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow key={"min_power_forecasting"}>
                    <TableCell component="th" scope="row" sx={{fontWeight: 600}}>
                      min power forecasting
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={!dataset.id.includes("beico") ? "Not available for this dataset" : "Predict"}>
                        <span>
                        <IconButton onClick={handleInference("min_power")} disabled={!dataset.id.includes("beico")}>
                          <QueryStatsIcon />
                        </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default ForecastingModelSelection;
