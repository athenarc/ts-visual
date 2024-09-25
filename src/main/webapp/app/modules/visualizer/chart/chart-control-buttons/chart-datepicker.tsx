import React from 'react';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import { updateQueryResults } from 'app/modules/store/visualizerSlice';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const ChartDatePicker = () => {
  const dispatch = useAppDispatch();

  const { chartRef, schemaMeta, dataset, from, to, viewPort, data, selectedMeasures, queryResults } = useAppSelector(state => state.visualizer);

  const handleOnAccept = (e, category) => {
    if (category === 'from') {
      chartRef.xAxis[0].setExtremes(e.getTime(), to);
      dispatch(updateQueryResults({ schema: schemaMeta.name, id: dataset.id, from: e.getTime(), to, viewPort, selectedMeasures, filter: {} }));
    } else {
      chartRef.xAxis[0].setExtremes(from, e.getTime());
      dispatch(updateQueryResults({ schema: schemaMeta.name, id: dataset.id, from, to: e.getTime(), viewPort, selectedMeasures, filter: {} }));
    }
  };

  return (
    <>
      <Typography variant="body1" fontWeight={600} fontSize={15}>
        Time
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          readOnly
          renderInput={p => <TextField size="small" {...p} />}
          label="From"
          value={from ? from : null}
          disabled={data === null}
          // minDateTime={dataset ? dataset.timeRange.from : null}
          // maxDateTime={to ? to : null}
          disableOpenPicker
          onAccept={e => {
            handleOnAccept(e, 'from');
          }}
          onChange={e => {}}
          inputFormat="dd/MM/yyyy hh:mm a"
        />
        <Typography variant="body1" fontWeight={400} fontSize={30}>
          {' - '}
        </Typography>
        <DateTimePicker
          readOnly
          disableOpenPicker
          renderInput={p => <TextField size="small" {...p} />}
          label="To"
          value={to ? to : null}
          disabled={data === null}
          // minDateTime={from ? from : null}
          // maxDateTime={dataset ? dataset.timeRange.to : null}
          onAccept={e => {
            handleOnAccept(e, 'to');
          }}
          onChange={e => {}}
          inputFormat="dd/MM/yyyy hh:mm a"
        />
      </LocalizationProvider>
    </>
  );
};

export default ChartDatePicker;
