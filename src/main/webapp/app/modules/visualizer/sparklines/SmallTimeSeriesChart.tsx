import React from 'react';
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from 'react-sparklines';

const SmallTimeSeriesChart = ({ data }) => {
  return (
    <div>
      <Sparklines data={data} width={100} height={30}>
        <SparklinesLine color="blue" />
        {/*<SparklinesReferenceLine type="avg" />*/}
      </Sparklines>
    </div>
  );
};

export default SmallTimeSeriesChart;
