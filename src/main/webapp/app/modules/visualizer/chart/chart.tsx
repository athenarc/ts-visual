import React, { useEffect, useRef, useState } from 'react';
import '../visualizer.scss';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import annotationsAdvanced from 'highcharts/modules/annotations-advanced';
import { useScrollBlock } from 'app/shared/util/useScrollBlock';
import { ITimeRange } from 'app/shared/model/time-range.model';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import {
  toggleCustomChangepoints,
  updateAlertResults,
  updateChartRef,
  updateCompareQueryResults,
  updateCustomChangepoints,
  updateFrom,
  updateM4QueryResults,
  updateQueryResults,
  updateTo,
  updateViewPort,
} from 'app/modules/store/visualizerSlice';
import { ChartPlotBands } from 'app/modules/visualizer/chart/chart-plot-bands/chart-plot-bands';
import chartAlertingChecker, { alertingPlotBandsCreator } from './chart-alerting/chart-alerting-functions';
import grey from '@mui/material/colors/grey';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';

HighchartsMore(Highcharts);
annotationsAdvanced(Highcharts);

export const Chart = () => {
  const {
    chartRef,
    dataset,
    from,
    to,
    schemaMeta,
    viewPort,
    selectedMeasures,
    customSelectedMeasures,
    measureColors,
    queryResultsLoading,
    m4QueryResultsLoading,
    filter,
    queryResults,
    m4QueryResults,
    changeChart,
    compare,
    customChangepointsEnabled,
    data,
    accuracy,
    m4Data,
    compareData,
    errorMessage,
    forecastData,
    alertResults,
    forecastingDataSplit,
    secondaryData,
    chartType,
    alerts,
    alertingPreview,
    activeTool,
    forecastingStartDate,
    forecastingEndDate,
    datasets,
    isUserStudy,
    queryResultsCompleted,
  } = useAppSelector(state => state.visualizer);

  const dispatch = useAppDispatch();

  const [blockScroll, allowScroll] = useScrollBlock();

  const [zones, setZones] = useState([]);
  const [customPlotBands, setCustomPlotBands] = useState([]);
  const [manualPlotBands, setManualPlotBands] = useState([]);
  const [alertingPlotBands, setAlertingPlotBands] = useState([]);
  const [detectedPlotBands, setDetectedPlotBands] = useState([]);
  const [changepointHighlight, setChangepointHighlight] = useState(false);
  const [m4Chart, setM4Chart] = useState(null);
  //Refs
  const fetchDataRef = useRef({ isScrolling: false, scrollTimeout: null });
  const chart = useRef(chartRef);
  const latestM4Chart = useRef(null);
  const timeRange = useRef(null);
  const latestSchema = useRef(null);
  const latestDatasetId = useRef(null);
  const latestMeasures = useRef(selectedMeasures);
  const latestCompare = useRef(compare);
  const latestFilter = useRef(filter);
  const latestPreview = useRef(alertingPreview);
  const latestCustomChangepoints = useRef([]);

  //change zones if forecasting is activated and both start & end date is set
  const getZones = color => {
    if (forecastingStartDate !== null && forecastingEndDate !== null) {
      return [
        { value: forecastingStartDate, color },
        { value: forecastingStartDate + (forecastingEndDate - forecastingStartDate) * (forecastingDataSplit[0] / 100), color: '#00FF00' },
        {
          value:
            forecastingStartDate +
            (forecastingEndDate - forecastingStartDate) * ((forecastingDataSplit[0] + forecastingDataSplit[1]) / 100),
          color: '#ff0000',
        },
        { value: forecastingEndDate, color: '#00FFFF' },
        { value: dataset.timeRange.to, color },
      ];
    } else {
      return null;
    }
  };

  // add plotlines for start & end date if forecasting is enabled
  useEffect(() => {
    if (forecastingStartDate !== null && forecastingEndDate !== null) {
      if (chartRef.xAxis[0].plotLinesAndBands.length > 0) {
        chartRef.xAxis[0].removePlotLine('start');
        chartRef.xAxis[0].removePlotLine('end');
      }
      chartRef.xAxis[0].addPlotLine({
        id: 'start',
        color: grey[500],
        value: forecastingStartDate,
        width: 2,
        zIndex: 3,
        label: { text: 'Start Date', verticalAlign: 'center', textAlign: 'left' },
      });
      chartRef.xAxis[0].addPlotLine({
        id: 'end',
        color: grey[500],
        value: forecastingEndDate,
        width: 2,
        zIndex: 3,
        label: { text: 'End Date', verticalAlign: 'center', textAlign: 'left' },
      });
    }
  }, [forecastingStartDate, forecastingEndDate]);

  // update chart height & width when toolkit window changes
  useEffect(() => {
    chartRef && chartRef.reflow();
  }, [activeTool]);

  useEffect(() => {
    latestPreview.current = alertingPreview;
  }, [alertingPreview]);


  useEffect(() => {
    data && alerts && dispatch(updateAlertResults(chartAlertingChecker(data, alerts, dataset, selectedMeasures, alertResults)));
  }, [selectedMeasures, data, alerts]);

  useEffect(() => {
    Object.keys(alertResults).length > 0 && setAlertingPlotBands(alertingPlotBandsCreator(alertResults, alerts));
  }, [alertResults, alerts]);

  useEffect(() => {
    latestFilter.current = filter;
  }, [filter]);

  useEffect(() => {
    if (chartRef !== null) {
      !queryResultsLoading && chartRef.hideLoading();
    }
  }, [queryResultsLoading]);

  useEffect(() => {
    if (m4Chart !== null) {
      !m4QueryResultsLoading && m4Chart.hideLoading();
    }
  }, [m4QueryResultsLoading]);

  useEffect(() => {
    if (Object.keys(compare).length !== 0) {
      dispatch(updateCompareQueryResults({ schema: schemaMeta.name, compare, from, to, viewPort, filter }));
    }
  }, [compare]);

  useEffect(() => {
    if (dataset) {
      latestMeasures.current = selectedMeasures;
      const viewPort = {width: 1000, height: 600};
      dispatch(
        updateQueryResults({
          schema: schemaMeta.name,
          id: dataset.id,
          from: from ? from : dataset.timeRange.to - (dataset.timeRange.to - dataset.timeRange.from) * 0.02,
          to: to ? to : dataset.timeRange.to,
          viewPort,
          selectedMeasures,
          filter,
        })
      );
      dispatch(updateViewPort(viewPort));
      if (Object.keys(compare).length !== 0) {
        dispatch(updateCompareQueryResults({ schema: schemaMeta.name, compare, from, to, viewPort, filter }));
      }
      if (
        selectedMeasures.length +
          customSelectedMeasures.length +
          Object.values(compare).reduce((acc: number, arr: number[]) => acc + arr.length, 0) ===
        6
      )
        toast('Maximum number of measures reached');
    }
  }, [dataset, selectedMeasures, accuracy]);

  useEffect(() => {
    if(isUserStudy && queryResultsCompleted) {
      try { latestM4Chart.current.showLoading()} catch(e) {};
      dispatch(
        updateM4QueryResults({
          schema: schemaMeta.name,
          id: dataset.id,
          from: from ? from : dataset.timeRange.to - (dataset.timeRange.to - dataset.timeRange.from) * 0.1,
          to: to ? to : dataset.timeRange.to,
          viewPort,
          selectedMeasures,
          filter,
        })
      );
      dispatch(updateViewPort(viewPort));
    }
  },[queryResultsCompleted]);

  useEffect(() => {
    latestCompare.current = compare;
  }, [compare]);

  useEffect(() => {
    latestM4Chart.current = m4Chart;
  }, [m4Chart]);

  useEffect(() => {
    if (customChangepointsEnabled && changepointHighlight === false) {
      toast('Highlight a region on the chart');
      setChangepointHighlight(true);
    }
  }, [customChangepointsEnabled]);

  const getChartRef = (chartR: any) => {
    dispatch(updateChartRef(chartR));
  };


  const toast = toastMessage => {
    chart.current.toast && chart.current.toast.destroy();
    if (chart.current) {
      const left = chart.current.plotWidth / 2;
      chart.current.toast = chart.current.renderer
        .label(toastMessage, left, 0)
        .attr({
          fill: Highcharts.getOptions().colors[1],
          padding: 10,
          r: 5,
          zIndex: 8,
        })
        .css({
          color: '#FFFFFF',
        })
        .add();
      setTimeout(function () {
        chart.current.toast && chart.current.toast.fadeOut();
      }, 2000);
      setTimeout(function () {
        if (chart.current.toast) chart.current.toast = chart.current.toast.destroy();
      }, 2500);
    }
  };

  const getChangepointData = (start, end, series) => {
    return series
      .map((s, idx) => {
        return {
          range: { from: start, to: end } as ITimeRange,
          measure: dataset.header.indexOf(s.userOptions.name),
          measureChartId: s.userOptions.index,
          id: latestCustomChangepoints.current.reduce((max, obj) => (obj.id > max ? obj.id : max), 0) + 1,
          custom: true,
        };
      })
      .filter(c => c.measure !== -1);
  };

  const customChangepointSelection = event => {
    event.preventDefault();
    const newCustomChangepoints = getChangepointData(event.xAxis[0].min, event.xAxis[0].max, event.target.series);
    latestCustomChangepoints.current = [...latestCustomChangepoints.current, ...newCustomChangepoints];
    dispatch(updateCustomChangepoints(latestCustomChangepoints.current));
    dispatch(toggleCustomChangepoints(false));
  };

  const setCustomChangepoints = newCustomChangepoints => {
    latestCustomChangepoints.current = newCustomChangepoints;
    dispatch(updateCustomChangepoints(latestCustomChangepoints.current));
  };

  const chartFunctions = (e: { target: any }) => {
    chart.current = e.target;
    timeRange.current = queryResults.timeRange;
    latestDatasetId.current = dataset.id;
    latestSchema.current = schemaMeta.name;

    const fetchData = () => {
      const { max, min } = chart.current.xAxis[0].getExtremes();
      chart.current.showLoading();
      const viewPort = {width: chart.current.plotWidth, height: chart.current.plotHeight};
      dispatch(
        updateQueryResults({
          schema: latestSchema.current,
          id: latestDatasetId.current,
          from: min,
          to: max,
          viewPort,
          selectedMeasures: latestMeasures.current,
          filter: latestFilter.current,
        })
      );
      dispatch(updateFrom(min));
      dispatch(updateTo(max));
      dispatch(updateViewPort(viewPort));
      if (Object.keys(latestCompare.current).length !== 0)
        dispatch(
          updateCompareQueryResults({
            schema: latestSchema.current,
            compare: latestCompare.current,
            from: min,
            to: max,
            viewPort,
            filter: latestFilter.current,
          })
        );  
    };

    const handleEventTimeout = event => {
      if (fetchDataRef.current.scrollTimeout) {
        clearTimeout(fetchDataRef.current.scrollTimeout);
      }

      fetchDataRef.current = { ...fetchDataRef.current, isScrolling: true };

      fetchDataRef.current = {
        ...fetchDataRef.current,
        scrollTimeout: setTimeout(() => {
          fetchDataRef.current = { ...fetchDataRef.current, isScrolling: false };
          fetchData();
        }, 500),
      };
    };

    // CHART: ZOOM FUNCTION
    Highcharts.addEvent(chart.current.container, 'wheel', (event: WheelEvent) => {
      const p = chart.current.xAxis[0].toValue(chart.current.pointer.normalize(event).chartX);
      const { min, max, dataMax, dataMin } = chart.current.xAxis[0].getExtremes();
      const stepleft = (p - min) * 0.25;
      const stepright = (max - p) * 0.25;
      const secondLoading = isUserStudy ? !latestM4Chart.current.loadingShown : true;
      if (!chart.current.loadingShown && secondLoading) {
        if (event.deltaY < 0 && max - min > 10000) {
          // in, 10000 is the max range on a zoom level
          chart.current.xAxis[0].setExtremes(min + stepleft, max - stepright, true, false);
          handleEventTimeout(event);
        } else if (event.deltaY > 0 && max - min < dataset.timeRange.to - dataset.timeRange.from) {
          // out
          chart.current.xAxis[0].setExtremes(
            Math.max(min - stepleft, dataset.timeRange.from),
            Math.min(max + stepright, dataset.timeRange.to),
            true,
            false
          );
          handleEventTimeout(event);
        }
      }
    });

    // CHART: PAN FUNCTION
    Highcharts.addEvent(chart.current.container, 'mouseup', (event: MouseEvent) => {
      const secondLoading = isUserStudy ? !latestM4Chart.current.loadingShown : true;
      if (!chart.current.loadingShown && secondLoading) {
        handleEventTimeout(event);
      }
    });

    // Set initial extremes
    //TODO: if intial data are empty throws error
    chart.current.xAxis[0].setExtremes(
      data[selectedMeasures[0]][2].timestamp,
      data[selectedMeasures[0]][data[selectedMeasures[0]].length - 2].timestamp
    );
  };

  const getSecondaryText = () => {
    return '';
  };

  // Required for pan to work
  const dummyPointCreator = (text, top, height) => ({
    title: {
      enabled: false,
      text,
    },
    opposite: false,
    top,
    height,
    lineWidth: 1,
    offset: 10,
    startOnTick: false,
    endOnTick: false
  });

  // Required for pan to work
  const dummySeriesCreator = (name, x, idx) => ({
    type: 'line',
    data: [
      {
        x,
        y: 0,
      },
    ],
    name,
    color: 'transparent',
    yAxis: 0,
    // yAxis: changeChart ? selectedMeasures.length + customSelectedMeasures.length + Object.values(compare).reduce((acc: number, arr: number[]) => acc + arr.length, 0) + idx : 0,
    // TODO: fix this
    zoneAxis: 'x',
    enableMouseTracking: false,
    showInLegend: false,
  });

  function normalizeData(array) {
    const max = Math.max(...array.map(item => item.value));
    return array.map(item => ({ timestamp: item.timestamp, value: item.value / max }));
  }

  // used for custom measure creation
  const combineData = (data1, data2) => {
    // Normalize both arrays
    const normalizedData1 = normalizeData(data1);
    const normalizedData2 = normalizeData(data2);
    return normalizedData1.map((item, index) => [item.timestamp, item.value / normalizedData2[index].value]);
  };

  const computeChartData = () => {
    let chartData =
      data !== null
        ? selectedMeasures
            .map((measure, index) => ({
              data: data[measure]
                ? data[measure].map(d => {
                    const val = d.value;
                    return [d.timestamp, isNaN(val) ? null : val];
                  })
                : [],
              name: dataset.header[measure],
              color: measureColors[measure],
              yAxis: changeChart ? index : 0,
              zoneAxis: 'x',
              zones: getZones(measureColors[measure]),
              showInLegend: true,
              enableMouseTracking: true,
            }))
            .concat(
              customSelectedMeasures.map((customMeasure, index) => ({
                data:
                  data[customMeasure.measure1] && data[customMeasure.measure2]
                    ? combineData(data[customMeasure.measure1], data[customMeasure.measure2])
                    : [],
                name: dataset.header[customMeasure.measure1] + '/' + dataset.header[customMeasure.measure2],
                color: measureColors[customMeasure.measure1],
                yAxis: changeChart ? index + selectedMeasures.length : 0,
                zoneAxis: 'x',
                zones: getZones(measureColors[customMeasure.measure1]),
                showInLegend: true,
                enableMouseTracking: true,
              }))
            )
        : [];
    if (secondaryData) {
      const sz =
        chartData !== null ? chartData.length + Object.values(compare).reduce((acc: number, arr: number[]) => acc + arr.length, 0) : 0;
      const sData = secondaryData.map(d => {
        const val = d.values[0];
        return { x: d.timestamp, y: isNaN(val) ? null : val, tt: d.values[1] ? 'Est. Power Loss: ' + d.values[1].toFixed(2) : null };
      }); // @ts-ignore
      chartData = [...chartData, { data: sData, yAxis: sz, color: 'blue', enableMouseTracking: true, name: getSecondaryText() }];
    }
    return chartData;
  };


  const computeYAxisData = () => {
    const allMeasuresLength =
      selectedMeasures.length +
      customSelectedMeasures.length +
      Object.values(compare).reduce((acc: number, arr: number[]) => acc + arr.length, 0);
    let counter = 0;
    let yAxisData = selectedMeasures
      .map((measure, idx) => ({
        title: {
          enabled: changeChart ? true : false,
          text: dataset.header[measure],
        },
        opposite: false,
        top: changeChart ? `${(100 / allMeasuresLength) * idx}%` : '0%',
        height: changeChart ? `${allMeasuresLength > 1 ? 100 / allMeasuresLength - 5 : 100}%` : '100%',
        lineWidth: 1,
        offset: 10,
        startOnTick: false,
        endOnTick: false
      }))
      .concat(
        customSelectedMeasures.map((customMeasure, idx) => ({
          title: {
            enabled: changeChart ? true : false,
            text: dataset.header[customMeasure.measure1] + '/' + dataset.header[customMeasure.measure2],
          },
          opposite: false,
          top: changeChart ? `${(100 / allMeasuresLength) * (idx + selectedMeasures.length)}%` : '0%',
          height: changeChart ? `${allMeasuresLength > 1 ? 100 / allMeasuresLength - 5 : 100}%` : '100%',
          lineWidth: 1,
          offset: 10,
          startOnTick: false,
          endOnTick: false,
        }))
      )
      .concat(
        Object.keys(compare).reduce((acc, curval) => {
          return [
            ...acc,
            ...compare[curval].map(measureVal => {
              const returnVal = {
                title: {
                  enabled: changeChart ? true : false,
                  text: curval + ': ' + datasets.data.find(d => d.id === curval).header[measureVal],
                },
                opposite: false,
                top: changeChart
                  ? `${(100 / allMeasuresLength) * (counter + (selectedMeasures.length + customSelectedMeasures.length))}%`
                  : '0%',
                height: changeChart ? `${allMeasuresLength > 1 ? 100 / allMeasuresLength - 5 : 100}%` : '100%',
                lineWidth: 1,
                offset: 10,
              };
              counter++;
              return returnVal;
            }),
          ];
        }, [])
      );
    if (secondaryData) {
      const sz = yAxisData.length;
      const percent = Math.floor(90 / sz);
      const newAxis = {
        title: {
          enabled: true,
          text: getSecondaryText(),
        },
        opposite: false,
        top: `0%`,
        height: `10%`,
        lineWidth: 1,
        offset: 10,
        startOnTick: false,
        endOnTick: false,
        plotBands: [],
      };
      yAxisData = changeChart
        ? yAxisData.map((y, idx) => ({
            ...y,
            height: (percent - 5).toString() + '%',
            top: (12 + percent * idx).toString() + '%',
          }))
        : yAxisData.map((y, idx) => ({
            ...y,
            height: '90%',
            top: '12%',
          }));
      yAxisData.push(newAxis);
    }
    yAxisData = yAxisData.concat(...[dummyPointCreator('minPoint', '-10px', '0px'), dummyPointCreator('maxPoint', '-10px', '0px')]);
    return yAxisData;
  };

  const computeM4ChartData = () => {
    let chartData =
      m4Data !== null
        ? selectedMeasures
            .map((measure, index) => ({
              data: m4Data[measure]
                ? m4Data[measure].map(d => {
                    const val = d.value;
                    return [d.timestamp, isNaN(val) ? null : val];
                  })
                : [],
              name: dataset.header[measure],
              color: measureColors[measure],
              yAxis: changeChart ? index : 0,
              zoneAxis: 'x',
              showInLegend: true,
              enableMouseTracking: true,
            }))
            .concat(
              customSelectedMeasures.map((customMeasure, index) => ({
                data:
                  m4Data[customMeasure.measure1] && m4Data[customMeasure.measure2]
                      ? combineData(m4Data[customMeasure.measure1], m4Data[customMeasure.measure2])
                      : [],
                  name: dataset.header[customMeasure.measure1] + '/' + dataset.header[customMeasure.measure2],
                  color: measureColors[customMeasure.measure1],
                  yAxis: changeChart ? index + selectedMeasures.length : 0,
                  zoneAxis: 'x',
                  showInLegend: true,
                  enableMouseTracking: true,
              }))
            )
        : [];
    return chartData;
  };

  const forecastChartData =
    forecastData !== null
      ? selectedMeasures.map((measure, index) => ({
          data: forecastData.map(d => {
            const val = d.values[index];
            return [d.timestamp, isNaN(val) ? null : val];
          }),
          name: 'Forecasted ' + dataset.header[measure],
          yAxis: changeChart ? index : 0,
          zoneAxis: 'x',
          color: 'black',
          showInLegend: true,
          enableMouseTracking: true,
          zones,
        }))
      : [];

  const compareChartData = () => {
    const allMeasuresLength = selectedMeasures.length + customSelectedMeasures.length;
    let counter = 0;
    return compareData.reduce((acc, curval, idx) => {
      return [
        ...acc,
        ...Object.keys(curval.data).map((index, indx) => {
          const returnVal = {
            data:
              compareData.length > 0
                ? Object.hasOwn(curval.data, index)
                  ? curval.data[index].map(obj => [obj.timestamp, obj.value])
                  : []
                : [],
            name: curval.name + ' ' + datasets.data.find(obj => obj.id === curval.name).header[index],
            yAxis: changeChart ? allMeasuresLength + counter : 0,
            color: 'black',
            showInLegend: true,
            enableMouseTracking: true,
            zoneAxis: 'x',
            zones,
          };
          counter++;
          return returnVal;
        }),
      ];
    }, []);
  };

  const handleMouseOverChart = () => {
    blockScroll();
    customChangepointsEnabled && chartRef
      ? chart.current.chartBackground.htmlCss({ cursor: 'crosshair' })
      : chart.current.chartBackground.htmlCss({ cursor: 'default' });
  };

  const handleMouseLeaveChart = () => {
    allowScroll();
  };

  // Event handler for chart updates
  const handleChartUpdate = (chart) => {
    setM4Chart(chart);
    // Synchronize secondary chart with the main chart
    const secondaryChart = chartRef && chartRef.current.chart;

    if (secondaryChart) {
      secondaryChart.series[0].setData(chart.series[0].options.data, true, false, false);
    }
  };

  const getPanningStatus = () => {
    return isUserStudy ? (!m4QueryResultsLoading && !queryResultsLoading) : !queryResultsLoading
  }

  const computeAccuracy = (maxErrorBound) => {
    return Math.floor(((accuracy + (1 - parseFloat(maxErrorBound))) / 2) * 100 * 100)  / 100;
  }

  return (
    <>
      <Grid
        sx={{
          border: '1px solid rgba(0, 0, 0, .1)',
          height: isUserStudy ? '50%' : '70%',
          position: 'relative',
        }}
        onMouseOver={() => (data ? handleMouseOverChart() : null)}
        onMouseLeave={() => (data ? handleMouseLeaveChart() : null)}
      > 
        {queryResultsLoading && errorMessage === null ? (
            <LinearProgress />
          ) : !queryResultsLoading && errorMessage !== null ? (
            <LinearProgress variant="determinate" color="error" value={100} className={'linear-prog-hide'} />
          ) : (
            <LinearProgress variant="determinate" color="success" value={100} className={'linear-prog-hide'} />
          )
        }
        {data && (
          <>
            <div style={{background: 'rgb(0,0,0,0.1)', padding:'1px', position: 'absolute', top: '-3px', right: '0px', zIndex: 999 }}>
              { queryResults.error ? (
                  <div><b>Accuracy: </b>{Object.entries(queryResults.error).map(([key, value]) => `${dataset.header[key]}: ${computeAccuracy(value)}%`).join('\n')}</div>
                ) : (
                  <div><b>Accuracy: </b>{Object.entries(queryResults.data).map(([key, value]) => `${dataset.header[key]}: 100%`).join('\n')}</div>
                )}
              <div><b>Time: </b>{queryResults.queryTime.toFixed(2)}s</div>
            </div>
            <HighchartsReact
                highcharts={Highcharts}
                  constructorType={'stockChart'}
                  containerProps={{ className: 'chartContainer', style: { height: 'calc(100% - 4px)', position: 'absolute', width: '100%' } }}
                  allowChartUpdate={true}
                  immutable={false}
                  ref={chartRef}
                  callback={getChartRef}
                  updateArgs={[true, true, true]}
                  options={{
                    title: null,
                    plotOptions: {
                      line: {
                        dataGrouping: {
                          enabled: false
                        }
                      },
                      series: {
                        connectNulls: false,
                        connectorAllowed: false,
                        lineWidth: 1,
                        states: {
                          hover: false,
                        },
                        boostThreshold: 0,
                        marker: {
                          enabled: Object.keys(filter).length !== 0 ? true : false,
                        },
                      },
                    },
                    tooltip: {
                      formatter: function () {
                        // The first returned item is the header, subsequent items are the
                        // points
                        return ['<b>' + new Date(this.x) + '</b>'].concat(
                          this.points
                            ? this.points.map(function (point) {
                                let ss = `<div><span style="color: ${point.color}; font-size: 12px; margin-right:5px;">●</span>  ${
                                  point.series.name
                                }: ${point.y.toFixed(2)}</div>`;
                                ss += point.point.tt ? `<br>${point.point.tt}</br>` : '';
                                return ss;
                              })
                            : []
                        );
                      },
                      split: true,
                    },
                    series: [
                      ...computeChartData(),
                      ...forecastChartData,
                      ...compareChartData(),
                      dummySeriesCreator('minPoint', dataset.timeRange.from, 0),
                      dummySeriesCreator('maxPoint', dataset.timeRange.to, 1),
                    ],
                    chart: {
                      type: chartType,
                      marginTop: 10,
                      plotBorderWidth: 0,
                      backgroundColor: !activeTool ? null : 'rgba(0,0,0, 0.05)',
                      zoomType: customChangepointsEnabled ? 'x' : false,
                      panning: {
                        enabled: getPanningStatus(),
                        type: 'x',
                      },
                      events: {
                        plotBackgroundColor: 'rgba(10,0,0,0)', // dummy color, to create an element
                        load: chartFunctions,
                        selection: customChangepointSelection,
                      },
                    },
                    xAxis: {
                      ordinal: false,
                      type: 'datetime',
                      plotBands: [...manualPlotBands, ...detectedPlotBands, ...customPlotBands, ...alertingPlotBands],
                    },
                    yAxis: computeYAxisData(),
                    rangeSelector: {
                      enabled: false,
                    },
                    navigator: {
                      enabled: false,
                      adaptToUpdatedData: false,
                    },
                    scrollbar: {
                      enabled: false,
                      liveRedraw: false,
                    },
                    colorAxis: null,
                    legend: {
                      enabled: !changeChart,
                    },
                    credits: {
                      enabled: false,
                    },
                    loading: {
                      labelStyle: {
                        color: 'black',
                        fontSize: '20px',
                      },
                      style: {
                        backgroundColor: 'transparent',
                      },
                    },
              }}
            />
          </>
        )}
        <ChartPlotBands
          manualPlotBands={manualPlotBands}
          setManualPlotBands={setManualPlotBands}
          detectedPlotBands={detectedPlotBands}
          setDetectedPlotBands={setDetectedPlotBands}
          customPlotBands={customPlotBands}
          setCustomPlotBands={setCustomPlotBands}
          customChangepoints={latestCustomChangepoints.current}
          setCustomChangepoints={setCustomChangepoints}
        />
      </Grid>
      {isUserStudy && 
        <Grid
          sx={{
            border: '1px solid rgba(0, 0, 0, .1)',
            height: '50%',
            position: 'relative',
          }}
        >
          {queryResultsCompleted && ( m4QueryResultsLoading && errorMessage === null ? (
            <LinearProgress />
            ) : !m4QueryResultsLoading && errorMessage !== null ? (
              <LinearProgress variant="determinate" color="error" value={100} className={'linear-prog-hide'} />
            ) : (
              <LinearProgress variant="determinate" color="success" value={100} className={'linear-prog-hide'} />
            ))
          }
          {m4Data && (
            <>
            <div style={{background: 'rgb(0,0,0,0.1)', padding:'1px', position: 'absolute', top: '-3px', right: '0px', zIndex: 999 }}>
                <div><b>Error-free Visualization</b></div>
                <div><b>Time: </b>{m4QueryResults.queryTime.toFixed(2)}s</div>
              </div>
              <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                containerProps={{ className: 'secondChartContainer', style: { height: 'calc(100% - 4px)', position: 'absolute', width: '100%' } }}
                allowChartUpdate={true}
                immutable={false}
                callback={handleChartUpdate}
                updateArgs={[true, true, true]}
                options={{
                  title: null,
                  plotOptions: {
                    line: {
                      dataGrouping: {
                        enabled: false
                      }
                    },
                    series: {
                      connectNulls: false,
                      connectorAllowed: false,
                      lineWidth: 1,
                      boostThreshold: 0,
                      states: {
                        hover: false,
                      },
                      marker: {
                        enabled: Object.keys(filter).length !== 0 ? true : false,
                      },
                    },
                  },
                  tooltip: {
                    formatter: function () {
                      // The first returned item is the header, subsequent items are the
                      // points
                      return ['<b>' + new Date(this.x) + '</b>'].concat(
                        this.points
                          ? this.points.map(function (point) {
                              let ss = `<div><span style="color: ${point.color}; font-size: 12px; margin-right:5px;">●</span>  ${
                                point.series.name
                              }: ${point.y.toFixed(2)}</div>`;
                              ss += point.point.tt ? `<br>${point.point.tt}</br>` : '';
                              return ss;
                            })
                          : []
                      );
                    },
                    split: true,
                  },
                  series: [
                    ...computeM4ChartData(),
                  ],
                  chart: {
                    type: chartType,
                    marginTop: 10,
                    plotBorderWidth: 0,
                    backgroundColor: !activeTool ? null : 'rgba(0,0,0, 0.05)',
                  },
                  xAxis: {
                    ordinal: false,
                    type: 'datetime',
                  },
                  yAxis: computeYAxisData(),
                  rangeSelector: {
                    enabled: false,
                  },
                  navigator: {
                    enabled: false,
                    adaptToUpdatedData: false,
                  },
                  scrollbar: {
                    enabled: false,
                    liveRedraw: false,
                  },
                  colorAxis: null,
                  legend: {
                    enabled: !changeChart,
                  },
                  credits: {
                    enabled: false,
                  },
                  loading: {
                    labelStyle: {
                      color: 'black',
                      fontSize: '20px',
                    },
                    style: {
                      backgroundColor: 'transparent',
                    },
                  },
                }}
              />
            </>
          )}
        </Grid>
      }
    </>
  );
};

export default Chart;
