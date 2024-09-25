import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import { setCompareData, setComparePopover, updateCompare } from 'app/modules/store/visualizerSlice';
import AddchartIcon from '@mui/icons-material/Addchart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

export const ChartCompare = () => {
  const dispatch = useAppDispatch();

  const { schemaMeta, dataset, comparePopover, compare, datasets, selectedMeasures, customSelectedMeasures, compareData } = useAppSelector(state => state.visualizer);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = event => {
    setAnchorEl(event.currentTarget);
    dispatch(setComparePopover(true));
  };

  const handleOnClick = (datasetId, measureId) => e => {
    // Create an empty object to store the updated comparison state
    let comp = {};

    // Case 1: Check if the datasetId is already present in the comparison
    if (Object.keys(compare).includes(datasetId)) {
        // Case 1.1: Check if the measureId is already selected for the dataset
        if (compare[datasetId].includes(measureId)) {
            // Case 1.1.1: If only one measure is selected for the dataset, remove the dataset from comparison
            if (compare[datasetId].length === 1) {
                const {[datasetId]: removedProperty, ...filteredCompare} = compare; 
                comp = filteredCompare;
                dispatch(setCompareData(compareData.filter(obj => obj.name !== datasetId)))
            } else {
                // Case 1.1.2: Remove the selected measure from the dataset
                comp = { ...compare, [datasetId]: compare[datasetId].filter(entry => entry !== measureId) };
            }
        } else {
            // Case 1.2: If measureId is not selected, add it to the dataset
            if (selectedMeasures.length + customSelectedMeasures.length + Object.values(compare).reduce((acc, arr) => acc + arr.length, 0) === 6) return;
            comp = { ...compare, [datasetId]: [...compare[datasetId], measureId] };
        }
    } else {
        // Case 2: If datasetId is not present in the comparison, create a new entry
        // Case 2.1: Check if the maximum number of allowed measures is reached
        if (selectedMeasures.length + customSelectedMeasures.length + Object.values(compare).reduce((acc, arr) => acc + arr.length, 0) === 6) return;
        comp = { ...compare, [datasetId]: [measureId] };
    }

    // Dispatch the action to update the comparison state with the new 'comp' object
    dispatch(updateCompare(comp));
};


  const handleClose = () => {
    dispatch(setComparePopover(false));
  };

  return (
    <>
      <Tooltip title="Compare Charts">
        <>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleOpen}
            disabled={datasets.loading}
          >
            {datasets.loading ? <CircularProgress size={20} /> : <AddchartIcon />}
          </IconButton>
        </>
      </Tooltip>
      <Popover
        id="long-menu"
        anchorEl={anchorEl}
        open={comparePopover}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          style: {
            maxHeight: 200,
            width: 'fit-content',
            margin: '1em',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'top',
            px: 1,
            pt: 1,
          }}
        >
          <AddchartIcon sx={{ pr: 1 }} />
          <Typography variant="body1" gutterBottom sx={{ fontWeight: 600, fontSize: '1em', alignSelf: "end" }}>
            Compare
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'left',
            alignItems: 'left',
            p: 1,
          }}
        >
          {datasets.data.length !== 0 && dataset &&
            datasets.data.map(
              (dat, idx) =>
                dat.id !== dataset.id && (
                  <Box key={`compare-${dat.id}-header`}>
                    <Typography variant="body1" gutterBottom sx={{ fontWeight: 600, fontSize: '1em' }}>
                      {dat.id}
                    </Typography>
                    {dat.header.map((hed, index) => (
                      <MenuItem
                        key={`${dat.id}-${hed}`}
                        selected={Object.hasOwn(compare, dat.id) ? compare[`${dat.id}`].includes(index) : false}
                        onClick={handleOnClick(dat.id, dat.header.indexOf(hed))}
                      >
                        <ListItemText>{hed}</ListItemText>
                        {Object.hasOwn(compare, dat.id) ? (
                          compare[dat.id].includes(dat.header.indexOf(hed)) ? (
                            <CheckCircleOutlineIcon />
                          ) : (
                            <RadioButtonUncheckedIcon />
                          )
                        ) : (
                          <RadioButtonUncheckedIcon />
                        )}
                      </MenuItem>
                    ))}
                  </Box>
                )
            )}
          {/* {schemaMeta.data.map(
            (file, idx) =>
              file.id !== dataset.id && (
                <MenuItem key={`${file.id}-${idx}`} selected={compare.includes(file.id)} onClick={handleOnClick(file.id)}>
                  <ListItemText>{file.id}</ListItemText>
                  {compare.includes(file.id) ? <CheckCircleOutlineIcon /> : <RadioButtonUncheckedIcon />}
                </MenuItem>
              )
          )} */}
        </Box>
      </Popover>
    </>
  );
};
