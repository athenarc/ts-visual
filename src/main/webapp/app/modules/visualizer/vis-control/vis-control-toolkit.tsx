import React from 'react';
import TimelineIcon from '@mui/icons-material/Timeline'; // segmentation
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import { setOpenToolkit, updateActiveTool } from 'app/modules/store/visualizerSlice';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import SimpleBar from 'simplebar-react';
import Divider from '@mui/material/Divider';
import grey from '@mui/material/colors/grey';

const VisToolkit = () => {
  const { schemaMeta, dataset, data } = useAppSelector(state => state.visualizer);
  const dispatch = useAppDispatch();

  const handleToolClick = key => e => {
    dispatch(setOpenToolkit(true));
    dispatch(updateActiveTool(key));
  };
  return (
    <Grid sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ height: '10%' }}>
        <Typography variant="h6" gutterBottom>
          Tools
        </Typography>
      </Box>
      {schemaMeta && dataset ? (
        <SimpleBar key="SimpleBarTools" style={{ border: `1px solid ${grey[300]}`, borderRadius: 10 }}>
          <Box sx={{ overflowY: 'auto', overflowX: 'hidden', margin: 'auto'}}>
            <List disablePadding>
              <ListItemButton key={0} onClick={handleToolClick('Forecasting')} disabled={data === null}>
                <ListItemIcon>
                  <TimelineIcon />
                </ListItemIcon>
                <ListItemText primary={'Forecasting'} />
              </ListItemButton>
              <Divider />
              <ListItemButton key={1} onClick={handleToolClick('Filtering')} disabled={data === null}>
                <ListItemIcon>
                  <FilterAltIcon />
                </ListItemIcon>
                <ListItemText primary={'Filtering'} />
              </ListItemButton>
            </List>
          </Box>
        </SimpleBar>
      ) : (
        <Skeleton variant="rounded" height="90%" width="100%" />
      )}
    </Grid>
  );
};

export default VisToolkit;
