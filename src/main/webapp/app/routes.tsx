import React from 'react';
import {Switch, Redirect, useLocation} from 'react-router-dom';

import Home from 'app/modules/home/home';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import Visualizer from "app/modules/visualizer/visualizer";
import Connector from './modules/visualizer/vis-connector/connector';
import VisConfigurer from './modules/visualizer/vis-configurer/configurer';
import UserStudyVisualizer from './modules/visualizer/user-study-visualizer';

const Routes = () => {
  const { pathname } = useLocation(); 
  return (
  <div className="view-routes">
    <Switch>
      <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} /> 
      <ErrorBoundaryRoute path="/" exact component={Home}/>
      <ErrorBoundaryRoute exact path={"/visualize"} component={Connector}/>
      <ErrorBoundaryRoute exact path={"/configure/:schema"} component={VisConfigurer} />
      <ErrorBoundaryRoute exact path={"/visualize/:schema/:id?"} component={Visualizer}/>
      <ErrorBoundaryRoute exact path={"/user-study/:type(influx|postgres)/visualize/:schema?/:id?"} component={UserStudyVisualizer}/>
      <ErrorBoundaryRoute component={PageNotFound}/>
    </Switch>
  </div>
  );
}

export default Routes;
