import React, {useEffect, useRef, useState} from "react";
import PlotBandLabels, {PlotBandPopover} from "app/modules/visualizer/chart/chart-plot-bands/plot-band-popover";
import Highcharts from "highcharts/highstock";
import {useAppDispatch, useAppSelector} from "app/modules/store/storeConfig";
import {IChangepointDate} from "app/shared/model/changepoint-date.model";
import {toggleCustomChangepoints, updateAnchorEl} from "app/modules/store/visualizerSlice";
import Popover from "@mui/material/Popover";

export interface IChartPlotBandsProps {
  customPlotBands: any,
  manualPlotBands: any,
  detectedPlotBands: any,
  setCustomPlotBands: any,
  setManualPlotBands: any,
  setDetectedPlotBands: any,
  customChangepoints: IChangepointDate[],
  setCustomChangepoints:any,
}


export const ChartPlotBands = (props: IChartPlotBandsProps) => {

  const {customChangepointsEnabled, anchorEl} = useAppSelector(state => state.visualizer);

  const dispatch = useAppDispatch();

  const customChangepoints = props.customChangepoints;
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  // const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [selectedPlot, setSelectedPlot] = useState(null);

  // Refs
  const latestCustomPlotBands = useRef(props.customPlotBands);

  // Color Bands for Custom Changepoints

  useEffect(() => {
    if (!customChangepointsEnabled) closePopover();
    let newPlotBands =  [].concat(...customChangepoints.map((date, idx) => {
      return {
        color: '#ebc634',
        from: date.range.from,
        to: date.range.to,
        id: date.id,
        borderWidth: 0,
        borderColor: 'black',
        events: {
          mouseup(e) {
            handlePlotBandSelection(e, this.id);
          },
          mouseover(e) {
            this.svgElem.attr('fill', new Highcharts.Color(this.options.color).brighten(0.1).get());
          },
          mouseout(e) {
            this.svgElem.attr('fill', this.options.color);
          },
        }
      };
    }));
    props.setCustomPlotBands(newPlotBands);
    latestCustomPlotBands.current = newPlotBands;
  }, [customChangepointsEnabled]);

  const handlePlotBandSelection = (event, id) => {
    setMouseX(event.clientX);
    setMouseY(event.clientY);
    setSelectedPlot(id);
    dispatch(updateAnchorEl(event.target));
    dispatch(toggleCustomChangepoints(true));
  }

  const closePopover = () => {
    dispatch(updateAnchorEl(null));
    dispatch(toggleCustomChangepoints(false));
  }

  return (
   <Popover
      id={id}
      anchorReference="anchorPosition"
      anchorPosition={{ top: mouseY, left: mouseX }}
      open={open}
      anchorEl={anchorEl}
      onClose={() => closePopover()}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <PlotBandPopover id={selectedPlot} changepoints={customChangepoints}
                      setChangepoints={props.setCustomChangepoints}
                       closePopover={closePopover}/>
    </Popover>
  );
}

export default  ChartPlotBands;
