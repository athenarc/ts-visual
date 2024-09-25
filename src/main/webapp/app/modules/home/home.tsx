import React, { useEffect } from 'react';
import { useAppDispatch } from '../store/storeConfig';
import { resetFetchData, disconnector } from '../store/visualizerSlice';
import './home.scss';


const Home = () => {
  const dispatch = useAppDispatch();

   useEffect(() => {
      dispatch(resetFetchData());
      dispatch(disconnector({}));
  }, []);

  
  return (
    <div className = "home">
      <div className = "container">
        <header className = "header">
          <h1>Welcome!</h1>
          <p>Explore, Contribute, and Participate!</p>
        </header>
        <div className="content">
          <p className="description">
          <b>Use our visualizer to connect to either InfluxDB or PostgreSQL and visualize, explore, and analyze your data.</b><br/>
          Dive deeper with our innovative User Study feature. <br/>
          Leverage our advanced caching system, MinMaxCache, as proposed in our paper titled "Visualization-aware Timeseries Min-Max Caching with Error Bound Guarantees."
          This caching system empowers you to explore your data efficiently and test different error bounds.
          Compare the results with the M4 accurate data for a comprehensive analysis.
          </p>
          <nav className="nav">
            <ul className="linkList">
              <li>
                <a href="https://github.com/MORE-EU/more-vis-index" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href="/visualize/" rel="noopener noreferrer">
                  Visualizer
                </a>
              </li>
              <li>
                <a href="/user-study/postgres/visualize/" rel="noopener noreferrer">
                  User Study
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

const styles = {
  
};

export default Home;
