import List from '@mui/material/List';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import { updateCustomSelectedMeasures, updateSelectedMeasures } from 'app/modules/store/visualizerSlice';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import CustomMeasureButton from 'app/modules/visualizer/vis-control/measures/custom-measure-button';
import CustomMeasureModal from 'app/modules/visualizer/vis-control/measures/custom-measure-modal';
import VisMeasuresList from 'app/modules/visualizer/vis-control/measures/vis-measures-list';
import Box from '@mui/material/Box';
import SimpleBar from 'simplebar-react';
import { Autocomplete, Skeleton } from '@mui/material';
import grey from '@mui/material/colors/grey';

export const VisMeasures = () => {
  const { dataset, selectedMeasures, customSelectedMeasures, isUserStudy, queryResultsLoading, m4QueryResultsLoading, measureColors, compare } = useAppSelector(state => state.visualizer);
  const [isCustomMeasureDialogOpen, setCustomMeasureDialogOpen] = useState(false);
  const [shownMeasures, setShownMeasures] = useState([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (dataset) {
      let indexes = [...selectedMeasures, dataset.header.indexOf(dataset.timeCol)];
      setShownMeasures(dataset.header.filter(function (value, index) {
        return indexes.indexOf(index) == -1;
      }))
    }
  }, [dataset]);

  const handleDelete = col => () => {
    if (selectedMeasures.length + customSelectedMeasures.length === 1) return;
    let newSelectedMeasures = [...selectedMeasures];
    newSelectedMeasures.splice(newSelectedMeasures.indexOf(col), 1);
    setShownMeasures(state => dataset.header.filter((val, idx) => state.includes(val) || idx === col))
    dispatch(updateSelectedMeasures(newSelectedMeasures));
  };

  const handleCustomMeasureDelete = customMeasure => () => {
    if (selectedMeasures.length + customSelectedMeasures.length === 1) return;
    let newCustomSelectedMeasures = [...customSelectedMeasures];
    newCustomSelectedMeasures = newCustomSelectedMeasures.filter(
      obj => obj.measure1 !== customMeasure.measure1 || obj.measure2 !== customMeasure.measure2
    );
    dispatch(updateCustomSelectedMeasures(newCustomSelectedMeasures));
  };

  const handleAddMeasure = (event, value) => {
    const id = dataset.header.indexOf(value);
    if (id !== -1) {
      let newSelectedMeasures = [...selectedMeasures];
      newSelectedMeasures.push(id);
      setShownMeasures(state => state.filter(s => s !== value))
      dispatch(updateSelectedMeasures(newSelectedMeasures));
    }
  };

  const handleCustomMeasureClick = () => {
    // Open the custom measure dialog
    setCustomMeasureDialogOpen(true);
  };

  const handleCustomMeasureModalClose = () => {
    // Close the custom measure dialog
    setCustomMeasureDialogOpen(false);
  };

  const getLoadingStatus =  () => {
    const secondLoad = isUserStudy ? m4QueryResultsLoading : false;
    return queryResultsLoading || secondLoad;
  }

  return (
    <Grid sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ height: '40%' }}>
        <Typography variant="h6" gutterBottom>
          Measures
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            columnGap: 1,
            justifyContent: 'left',
            alignItems: 'center',
            p: 0,
          }}
        >
          {dataset ? (
            <>
              <Tooltip
                title={
                  selectedMeasures.length +
                    customSelectedMeasures.length +
                    Object.values(compare).reduce((acc, arr) => acc + arr.length, 0) ===
                  6
                    ? 'You can only view up to 6 measures at a time'
                    : ''
                }
              >
                <>
                  <VisMeasuresList
                    width={'80%'}
                    value={null}
                    onChange={handleAddMeasure}
                    options={shownMeasures}
                    disabled={
                      selectedMeasures.length +
                        customSelectedMeasures.length +
                        Object.values(compare).reduce((acc, arr) => acc + arr.length, 0) ===
                      6 || getLoadingStatus()
                    }
                  />
                </>
              </Tooltip>
              <CustomMeasureButton onClick={handleCustomMeasureClick} disabled={selectedMeasures.length +
                  customSelectedMeasures.length +
                  Object.values(compare).reduce((acc, arr) => acc + arr.length, 0) ===
                6  || getLoadingStatus()}/>
              <CustomMeasureModal open={isCustomMeasureDialogOpen} onClose={handleCustomMeasureModalClose} />
            </>
          ) : (
            <>
              <Skeleton variant="rounded" width="80%" height={40} />
              <Skeleton variant="circular" width={40} height={40} />
            </>
          )}
        </Box>
      </Box>
      {dataset ? (  <SimpleBar key="SimpleBarMeasures" style={{ maxHeight: '60%', border: `1px solid ${grey[300]}`, borderRadius: 10 }}>
      <Box sx={{ overflowY: 'auto' }}>
        
            <List dense sx={{ width: '100%', maxWidth: 360, mb: 3 }}>
              {selectedMeasures
                .map(col => {
                  const labelId = `checkbox-list-secondary-label-${col}`;
                  return (
                    <Chip
                      label={dataset.header[col]}
                      key={labelId}
                      disabled={getLoadingStatus()}
                      sx={{ bgcolor: measureColors[col], color: 'white', m: 0.5 }}
                      variant="outlined"
                      deleteIcon={
                        <Tooltip title={customSelectedMeasures.length + selectedMeasures.length === 1 ? 'Cannot remove last measure' : ''}>
                          <HighlightOffIcon style={{ color: 'white' }} />
                        </Tooltip>
                      }
                      onDelete={handleDelete(col)}
                    />
                  );
                })
                .concat(
                  customSelectedMeasures.map(customMeasure => {
                    const labelId = `custom-checkbox-list-secondary-label-${customMeasure.measure1 - customMeasure.measure2}`;
                    return (
                      <Chip
                        label={dataset.header[customMeasure.measure1] + '/' + dataset.header[customMeasure.measure2]}
                        key={labelId}
                        disabled={getLoadingStatus()}
                        sx={{ bgcolor: measureColors[customMeasure.measure1], color: 'white', m: 0.5 }}
                        variant="outlined"
                        deleteIcon={
                          <Tooltip
                            title={customSelectedMeasures.length + selectedMeasures.length === 1 ? 'Cannot remove last measure' : ''}
                          >
                            <HighlightOffIcon style={{ color: 'white' }} />
                          </Tooltip>
                        }
                        onDelete={handleCustomMeasureDelete(customMeasure)}
                      />
                    );
                  })
                )}
            </List>          
         
      </Box>
      </SimpleBar>) : (
          <Skeleton variant="rounded" sx={{height: "60%"}} width="100%" />
        )}
    </Grid>
  );
};

export default VisMeasures;
