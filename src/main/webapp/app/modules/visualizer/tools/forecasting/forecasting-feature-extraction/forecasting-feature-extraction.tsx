import React, { Dispatch, SetStateAction } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { IForecastingForm } from 'app/shared/model/forecasting.model';
import OptionalFeaturesTable from './forecasting-optional-features';
import Features from './forecasting-features';

interface IForecastingFeatureExtr {
  forecastingForm: IForecastingForm;
  setForecastingForm: Dispatch<SetStateAction<IForecastingForm>>;
}

const ForecastingFeatureExtr = (props: IForecastingFeatureExtr) => {
  const { forecastingForm, setForecastingForm } = props;

  return (
    <>
      <Grid className={'Features-values'} sx={{ width: '100%', display: 'flex', flexDirection: 'column', rowGap: 2, textAlign: 'center' }}>
        <Grid
          sx={{
            width: '90%',
            m: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            rowGap: 2,
          }}
        >
          <Grid sx={{ width: '100%', borderBottom: '1px solid rgba(0,0,0,0.3)' }}>
            <Typography variant="subtitle1" fontSize={20}>
              Features
            </Typography>
          </Grid>
          <Features forecastingForm={forecastingForm} setForecastingForm={setForecastingForm} />
        </Grid>
        <Grid className="optional-feature-extraction" sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
          <Grid sx={{ width: '90%', borderBottom: '1px solid rgba(0,0,0,0.3)', m: 'auto' }}>
            <Typography variant="subtitle1" fontSize={20}>
              Optional Features
            </Typography>
          </Grid>
          <Grid sx={{width: "80%", m: "auto"}}>
            <OptionalFeaturesTable forecastingForm={forecastingForm} setForecastingForm={setForecastingForm} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ForecastingFeatureExtr;
