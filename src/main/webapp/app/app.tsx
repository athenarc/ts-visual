import React, {useEffect} from 'react';
import {hot} from 'react-hot-loader';
import {BrowserRouter as Router} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';
import ErrorBoundary from 'app/shared/error/error-boundary';
import AppRoutes from 'app/routes';
import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import { useAppDispatch } from './modules/store/storeConfig';
import { getProfile } from './shared/reducers/application-profile';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export const App = () => {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  return (
    <Router basename={baseHref}>
      <div className="app-container">
        <ToastContainer position={toast.POSITION.TOP_LEFT} className="toastify-container"
                        toastClassName="toastify-toast"/>
        <div className="container-fluid view-container" id="app-view-container">
          <ErrorBoundary>
            <AppRoutes/>
          </ErrorBoundary>
        </div>
      </div>
    </Router>
  );
};

export default hot(module)(App);
