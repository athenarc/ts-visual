import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import DevTools from './config/devtools';
import ErrorBoundary from './shared/error/error-boundary';
import AppComponent from './app';
import { store } from './modules/store/storeConfig';

const devTools = process.env.NODE_ENV === 'development' ? <DevTools/> : null;

const rootEl = document.getElementById('root');
// TODO: Fix devTools
const render = Component =>
  // eslint-disable-next-line react/no-render-return-value
  ReactDOM.render(
    <ErrorBoundary>
      <Provider store={store}>
        <div>
          {/* If this slows down the app in dev disable it and enable when required  */}
          {/* {devTools} */}
          <Component/>
        </div>
      </Provider>
    </ErrorBoundary>,
    rootEl
  );

render(AppComponent);
