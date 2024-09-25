import * as React from 'react';
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useHistory } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Slide, { SlideProps } from '@mui/material/Slide';

import { useAppDispatch, useAppSelector } from '../../store/storeConfig';
import { setErrorMessage, resetFetchData, setConnented } from '../../store/visualizerSlice';
import Header from '../header/header';
import VisConnector from './vis-connector';

const mdTheme = createTheme();
type TransitionProps = Omit<SlideProps, 'direction'>;

export const Connector = () => {
    const [openSnack, setOpenSnack] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { schemaMeta, datasetChoice, selectedConnection, connected, errorMessage } = useAppSelector(state => state.visualizer);
    const dispatch = useAppDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(resetFetchData());
        setIsMounted(true);
    },[]);

    function TransitionLeft(props: TransitionProps) {
        return <Slide {...props} direction="left" />;
    }
    
    useEffect(() => {
        if (isMounted && schemaMeta && schemaMeta.isTimeSeries) history.push(`/visualize/${schemaMeta.name}/${schemaMeta.data[datasetChoice].id}`);
        if (isMounted && schemaMeta && !schemaMeta.isTimeSeries) history.push(`/configure/${schemaMeta.name}`);
    },[schemaMeta]);
    
    useEffect(() => {
        if(errorMessage) setOpenSnack(true);
    }, [errorMessage]);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (connected) dispatch(setConnented(false));
        dispatch(setErrorMessage(null));
        setOpenSnack(false);
    };

    return (
        <div>
            <ThemeProvider theme={mdTheme}>
                {errorMessage &&
                    <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleClose}
                    TransitionComponent={TransitionLeft}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }} variant='filled'>
                            <>{errorMessage}</>
                        </Alert>
                    </Snackbar>
                }
                <Grid sx={{ height: '100%', width: '100%' }}>
                    <Header schemaMeta={schemaMeta} datasetChoice={datasetChoice} selectedConnection={selectedConnection} />
                    <Divider />
                    <Grid
                    sx={{
                        backgroundColor: theme => theme.palette.background.paper,
                        display: 'flex',
                        flexDirection: 'row',
                        overflow: 'auto',
                        height: 'calc(100% - 65px)',
                    }}
                    >
                        <Grid sx={{ width: '20%', height: 'calc(100% - 30px)', p: 1 }}>
                            <Paper elevation={1} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
                                <VisConnector />
                            </Paper>
                        </Grid>
                        <Grid sx={{ width: '80%', p: 1, flexGrow: 1, height: 'calc(100% - 30px)' }}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                }}
                            >
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </div>
    );
};

export default Connector;
