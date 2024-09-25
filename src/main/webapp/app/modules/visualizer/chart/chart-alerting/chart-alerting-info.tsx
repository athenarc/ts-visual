import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import PreviewIcon from '@mui/icons-material/Preview';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import { useAppDispatch } from 'app/modules/store/storeConfig';
import { setAlertingPlotMode, updateAlertResults } from 'app/modules/store/visualizerSlice';
import moment from 'moment';
import React from 'react';
import Box from '@mui/material/Box';

const AlertingInfo = props => {
  const dispatch = useAppDispatch();

  const handleShowButton = e => {
    // dispatch(setAlertingPlotMode(true));
    dispatch(
      updateAlertResults({
        ...props.alertResults,
        [props.alertPreviewName]: { ...props.alertResults[props.alertPreviewName], show: !props.alertResults[props.alertPreviewName].show },
      })
    );
  };

  return (
    <>
      {!props.alertPreviewName ? (
        <>
          <Grid>
            <Typography id="modal-error-message" color={'#757575'} component="span" variant="subtitle1" fontSize={18}>
              Press {<VisibilityIcon sx={{ verticalAlign: 'middle' }} />} in order to see alert results
            </Typography>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography id="modal-modal-title" variant="h5" sx={{ alignSelf: 'center' }} component="span">
              Results
            </Typography>
            {Object.hasOwn(props.alertResults, props.alertPreviewName) && (
              <Tooltip title="Chart Preview" placement="right">
                <IconButton
                  aria-label="chart-preview"
                  id="long-button"
                  size="large"
                  aria-controls={open ? 'long-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleShowButton}
                >
                  {props.alertResults[props.alertPreviewName].show ? (
                    <VisibilityOffIcon fontSize="large" />
                  ) : (
                    <VisibilityIcon fontSize="large" />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TableContainer component={Box} sx={{ height: 200 }}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Start Date</TableCell>
                    <TableCell align="left">End Date</TableCell>
                    <TableCell align="right">Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.alertResults.hasOwnProperty(props.alertPreviewName) &&
                    props.alertResults[props.alertPreviewName].results.map((item, idx) => (
                      <TableRow key={`row-result-${idx}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="left">{moment(item[0]).format('DD-MM-YYYY HH:mm:ss').toString()}</TableCell>
                        <TableCell align="left">{moment(item[1]).format('DD-MM-YYYY HH:mm:ss').toString()}</TableCell>
                        <TableCell align="right">{moment.duration(moment(item[1]).diff(moment(item[0]))).humanize()}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </>
      )}
    </>
  );
};

export default AlertingInfo;
