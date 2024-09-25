import React, { useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import Grid from '@mui/material/Grid';
import { getInitialSeries, setForecastingInitialSeries } from 'app/modules/store/forecastingSlice';
import { useParams } from 'react-router-dom';

HighchartsMore(Highcharts);

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height: 'max-content',
  bgcolor: 'background.paper',
  boxShadow: 24,
};

const ModalWithChart = props => {
  const { chartRef, dataset } = useAppSelector(state => state.visualizer);
  const { forecastingInitialSeries } = useAppSelector(state => state.forecasting);
  const { resultsModal, setResultsModal, forecastingData } = props;
  const params: any = useParams();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (forecastingData.results[resultsModal]) {
      const resultKeys = Object.keys(forecastingData.results[resultsModal]);
      const timestamps = Object.entries(forecastingData.results[resultsModal][resultKeys[0]].predictions).map(
        ([key, value]) => parseInt(key) * 1000
      );
      const minTimestamp = Math.min(...timestamps);
      const maxTimestamp = Math.max(...timestamps);
      dispatch(getInitialSeries({ from: minTimestamp, to: maxTimestamp, schema: params.schema, id: dataset.id, measure: resultsModal }));
    }
  }, [forecastingData.results[resultsModal]]);

  const handleClose = () => {
    setResultsModal(null);
    dispatch(setForecastingInitialSeries(null));
  };

  const generateCharts = () => {
    const initialSeriesData = forecastingInitialSeries[dataset.header.indexOf(resultsModal)].map(d => [parseInt(d.timestamp), d.value]);
    return [
      ...Object.keys(forecastingData.results[resultsModal]).map(key => ({
        name: key,
        opposite: false,
        data: Object.entries(forecastingData.results[resultsModal][key].predictions).map(([key, value]) => [parseInt(key) * 1000, value]),
        offset: 0,
      })),
      {
        name: 'initial Series',
        opposite: false,
        offset: 0,
        data: initialSeriesData,
      },
    ];
  };

  const options = {
    title: {
      text: 'Initial vs. Predicted Time Series',
    },
    series: forecastingData.results[resultsModal] && forecastingInitialSeries ? generateCharts() : null,
    xAxis: {
      ordinal: false,
      type: 'datetime',
    },
    plotOptions: {
      series: {
          dataGrouping: {
              enabled: true,
              forced: true,
              units: [
               ['minute', [15]]
               ]
          },
      }
    },
    rangeSelector: {
      enabled: false,
    },
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <>
      <Modal open={resultsModal !== null} onClose={handleClose}>
        <Grid sx={style}>
          <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />
        </Grid>
      </Modal>
    </>
  );
};

export default ModalWithChart;
