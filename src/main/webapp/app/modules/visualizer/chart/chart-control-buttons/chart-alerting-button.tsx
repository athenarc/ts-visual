import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import PropTypes from 'prop-types';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { setAlertingPreview } from 'app/modules/store/visualizerSlice';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import AlertsTable from '../chart-alerting/chart-alerting-table';
import AlertAddEdit from '../chart-alerting/chart-alerting-add-edit';
import AlertingInfo from '../chart-alerting/chart-alerting-info';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -40%)',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 10,
  width: 980,
  p: 4,
};

export const ChartAlerting = () => {
  const { alertResults, chartRef, alerts, dataset } = useAppSelector(state => state.visualizer);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [alertInfo, setAlertInfo] = useState(null);
  const [alertPreviewName, setAlertPreviewName] = useState(null);

  const a11yProps = index => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  const TabPanel = props => {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
      </div>
    );
  };

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  const handleModal = () => {
    setOpen(!open);
    dispatch(setAlertingPreview(true));
  };

  const handleChange = (e, newVal) => {
    setValue(newVal);
    newVal === 0 && (setAlertInfo(null), setAlertPreviewName(null));
  };

  const getAlertsLength = () => {
    return Object.values(alertResults)
      .map((ar: {}) => ar["results"].length)
      .reduce((a, b) => a + b, 0);
  };

  const badgeColor = () => {
    const colorMap = {
      1: "primary",
      2: "warning",
      3: "error"
    }
    return colorMap[Math.max(...Object.values(alertResults).map((res: {severity: number}) => res.severity))];
  };

  return (
    <>
      <Badge badgeContent={getAlertsLength()} color={badgeColor()}>
        <Tooltip title="Alerting" placement="bottom">
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleModal}
            disabled={dataset === null}
          >
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
      </Badge>
      <Modal open={open} onClose={handleModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Grid container>
            <Grid item xs={12} sx={{ mb: 3 }}>
            <Typography id="modal-modal-description" component={'span'} variant="h5" fontSize={25}>
                Saved Alerts
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <AlertsTable setAlertInfo={setAlertInfo} setValue={setValue} setAlertPreviewName={setAlertPreviewName} />
            </Grid>
            <Grid item xs={12} sx={{ mb: 2, height: 388, width: 753 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Add" {...a11yProps(0)} />
                  <Tab label="Edit" {...a11yProps(1)} />
                  <Tab label="Info" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <AlertAddEdit action="add" alertInfo={null} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <AlertAddEdit action="edit" alertInfo={alertInfo} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <AlertingInfo alertResults={alertResults} alertPreviewName={alertPreviewName} setOpen={setOpen} chartRef={chartRef} />
              </TabPanel>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};
