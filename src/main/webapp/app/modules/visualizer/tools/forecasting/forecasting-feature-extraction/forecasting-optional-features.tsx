import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { Dispatch, SetStateAction } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import { IForecastingForm } from 'app/shared/model/forecasting.model';

const CollapseTemporal = props => {
  const { open, handleTemporalCheckboxes, forecastingForm } = props;
  const temporalSelection = ['Minute', 'Month', 'Is Working Hour', 'Hour', 'WeekDay', 'Is Weekend', 'Day', 'Week of Year'];
  const temporalSelectionMap = {
    'Minute':"minute",
    'Month': "month", 
    'Is Working Hour': "is_working_hour", 
    'Hour': "hour", 
    'WeekDay': "weekday", 
    'Is Weekend': "is_weekend", 
    'Day': "day", 
    'Week of Year': "week_of_year"
  }
  return (
    Object.hasOwn(forecastingForm.features.optionalFeatures, 'temporal') && (
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={open} timeout="auto">
          <Box sx={{ margin: 0 }}>
            <Typography variant="h6" gutterBottom component="div">
              Temporal Selection
            </Typography>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  {temporalSelection.map(text => (
                    <TableCell key={`${text}-temp-header-column`} align="center">
                      {text}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {temporalSelection.map(text => (
                    <TableCell key={`${text}-temp-body-column`} align="center">
                      <Checkbox
                        value={forecastingForm.features.optionalFeatures['temporal'].includes(text)}
                        onChange={handleTemporalCheckboxes(temporalSelectionMap[text])}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    )
  );
};

const CollapsePastMetr = props => {
  const { open, handlePastMetricsCheckboxes, forecastingForm } = props;
  const pastMetrCategories = ['Previous Hour', 'Previous Day', 'Previous Week', 'Previous Month'];
  const pastMetrSelection = ['Actual Load', 'Average Load', 'Min Load', 'Max Load'];
  const pastMetrSelectionMap = {
    'Actual Load': "actual", 
    'Average Load': "average", 
    'Min Load': "min", 
    'Max Load': "max"
  }
  return (
    Object.hasOwn(forecastingForm.features.optionalFeatures, 'pastMetrics') && (
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 0 }}>
            <Typography variant="h6" gutterBottom component="div">
              Past Metrics Selection
            </Typography>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell />
                  {pastMetrSelection.map(text => (
                    <TableCell key={`${text}-pastMetr-header-column`} align="center">
                      {text}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pastMetrCategories.map(text => (
                  <TableRow key={`${text}-pastMetr-row`}>
                    <TableCell align="left">{text}</TableCell>
                    {pastMetrSelection.map(textMetric => (
                      <TableCell key={`${textMetric}-pastMetr-body-column`} align="center">
                        <Checkbox
                          value={forecastingForm.features.optionalFeatures['pastMetrics'][map[text]].includes(textMetric)}
                          onChange={handlePastMetricsCheckboxes(text, pastMetrSelectionMap[textMetric])}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    )
  );
};

const CollapseDerivatives = props => {
  const { open, handleDerivativesCheckboxes, forecastingForm } = props;
  const derivativesSelection = ['Slope', 'Curvature'];
  return (
    Object.hasOwn(forecastingForm.features.optionalFeatures, 'derivatives') && (
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 0 }}>
            <Typography variant="h6" gutterBottom component="div">
              Derivatives Selection
            </Typography>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  {derivativesSelection.map(text => (
                    <TableCell key={`${text}-deriv-head-column`} align="center">
                      {text}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {derivativesSelection.map(textDeriv => (
                    <TableCell key={`${textDeriv}-deriv-body-column`} align="center">
                      <Checkbox
                        value={forecastingForm.features.optionalFeatures['derivatives'].includes(textDeriv)}
                        onChange={handleDerivativesCheckboxes(textDeriv)}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    )
  );
};

const map = {
  'Previous Hour': 'prevHour',
  'Previous Day': 'prevDay',
  'Previous Week': 'prevWeek',
  'Previous Month': 'prevMonth',
};

const mapFeaturesNames = {
  Temporal: 'temporal',
  'Past Metrics': 'pastMetrics',
  Derivatives: 'derivatives',
};

const Row = props => {
  const { row, forecastingForm, setForecastingForm } = props;
  const [open, setOpen] = React.useState(false);

  const hadleOptionalFeatureCheckBoxes = value => e => {
    if (Object.hasOwn(forecastingForm.features.optionalFeatures, value)) {
      const feat = forecastingForm.features.optionalFeatures;
      delete feat[value];
      setForecastingForm(state => ({ ...state, features: { ...state.features, optionalFeatures: feat } }));
    } else {
      if (value === 'pastMetrics') {
        setForecastingForm(state => ({
          ...state,
          features: {
            ...forecastingForm.features,
            optionalFeatures: { ...state.features.optionalFeatures, [value]: { prevDay: [], prevHour: [], prevWeek: [], prevMonth: [] } },
          },
        }));
      } else {
        setForecastingForm(state => ({
          ...state,
          features: { ...forecastingForm.features, optionalFeatures: { ...state.features.optionalFeatures, [value]: [] } },
        }));
      }
    }
  };

  const handleTemporalCheckboxes = value => e => {
    if (forecastingForm.features.optionalFeatures.temporal.includes(value)) {
      setForecastingForm(state => ({
        ...state,
        features: {
          ...state.features,
          optionalFeatures: {
            ...state.features.optionalFeatures,
            temporal: state.features.optionalFeatures.temporal.filter(val => val !== value),
          },
        },
      }));
    } else {
      setForecastingForm(state => ({
        ...state,
        features: {
          ...state.features,
          optionalFeatures: { ...state.features.optionalFeatures, temporal: [...state.features.optionalFeatures.temporal, value] },
        },
      }));
    }
  };

  const handlePastMetricsCheckboxes = (mapValue, value) => e => {
    if (forecastingForm.features.optionalFeatures.pastMetrics[map[mapValue]].includes(value)) {
      setForecastingForm(state => ({
        ...state,
        features: {
          ...state.features,
          optionalFeatures: {
            ...state.features.optionalFeatures,
            pastMetrics: {
              ...state.features.optionalFeatures.pastMetrics,
              [map[mapValue]]: state.features.optionalFeatures.pastMetrics[map[mapValue]].filter(val => val !== value),
            },
          },
        },
      }));
    } else {
      setForecastingForm(state => ({
        ...state,
        features: {
          ...state.features,
          optionalFeatures: {
            ...state.features.optionalFeatures,
            pastMetrics: {
              ...state.features.optionalFeatures.pastMetrics,
              [map[mapValue]]: [...state.features.optionalFeatures.pastMetrics[map[mapValue]], value],
            },
          },
        },
      }));
    }
  };

  const handleDerivativesCheckboxes = value => e => {
    if (forecastingForm.features.optionalFeatures.derivatives.includes(value)) {
      setForecastingForm(state => ({
        ...state,
        features: {
          ...state.features,
          optionalFeatures: {
            ...state.features.optionalFeatures,
            derivatives: state.features.optionalFeatures.derivatives.filter(val => val !== value),
          },
        },
      }));
    } else {
      setForecastingForm(state => ({
        ...state,
        features: {
          ...state.features,
          optionalFeatures: { ...state.features.optionalFeatures, derivatives: [...state.features.optionalFeatures.derivatives, value] },
        },
      }));
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <Checkbox
            checked={Object.hasOwn(forecastingForm.features.optionalFeatures, mapFeaturesNames[row.name])}
            onChange={hadleOptionalFeatureCheckBoxes(mapFeaturesNames[row.name])}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell component="th" scope="row">
          <Tooltip title={row.info} placement="right">
            <HelpIcon color="primary" />
          </Tooltip>
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            disabled={!Object.hasOwn(forecastingForm.features.optionalFeatures, mapFeaturesNames[row.name])}
          >
            {open && Object.hasOwn(forecastingForm.features.optionalFeatures, mapFeaturesNames[row.name]) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        {row.name === 'Temporal' ? (
          <CollapseTemporal open={open} handleTemporalCheckboxes={handleTemporalCheckboxes} forecastingForm={forecastingForm} />
        ) : row.name === 'Past Metrics' ? (
          <CollapsePastMetr open={open} handlePastMetricsCheckboxes={handlePastMetricsCheckboxes} forecastingForm={forecastingForm} />
        ) : (
          <CollapseDerivatives open={open} handleDerivativesCheckboxes={handleDerivativesCheckboxes} forecastingForm={forecastingForm} />
        )}
      </TableRow>
    </>
  );
};

const rows = [
  {
    name: 'Temporal',
    info: 'Any feature that is associated with or changes over time (time-related data), such as hour, minute, day, weekday, etc..',
  },
  {
    name: 'Past Metrics',
    info: 'Features associated with the past that happened in the same chronological interval, such as last day, last week, etc.',
  },
  {
    name: 'Derivatives',
    info:
      'Generated features by calculating the first and second derivatives of the input features. The first derivative represents the slope of a curve, while the second derivative represents its curvature.',
  },
];

interface IOptionalFeaturesTable {
  forecastingForm: IForecastingForm;
  setForecastingForm: Dispatch<SetStateAction<IForecastingForm>>;
}

const OptionalFeaturesTable = (props: IOptionalFeaturesTable) => {
  const { forecastingForm, setForecastingForm } = props;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Include</TableCell>
            <TableCell>feature Name</TableCell>
            <TableCell>Info</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <Row key={row.name} row={row} forecastingForm={forecastingForm} setForecastingForm={setForecastingForm} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OptionalFeaturesTable;
