import * as React from 'react';
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useHistory, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';

import VisControlDatasetConfig from './vis-control-dataset-config';
import VisControlDatasetSelection from './vis-control-dataset-selection';


import { useAppDispatch, useAppSelector } from '../../store/storeConfig';
import { setDatasetIsConfiged, setErrorMessage, getSchemaMetadata, resetDataset, resetUploadDatasetError } from '../../store/visualizerSlice';
import Header from '../header/header';

const mdTheme = createTheme();

export const VisConfigurer = () => {
    const [openSnack, setOpenSnack] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [datasetIsSelected, setDatasetIsSelected] = useState(false);
    const { schemaMeta, datasetChoice, selectedConnection, datasetIsConfiged, errorMessage } = useAppSelector(state => state.visualizer);
    const dispatch = useAppDispatch();
    const history = useHistory();
    const params: any = useParams();


    useEffect(() => {
        dispatch(setDatasetIsConfiged(false));
        dispatch(resetDataset());
        dispatch(resetUploadDatasetError());
        setIsMounted(true);
        !schemaMeta && dispatch(getSchemaMetadata({schema: params.schema}));
    },[]);

    useEffect(() => {
        if (isMounted && schemaMeta && datasetIsConfiged) history.push(`/visualize/${schemaMeta.name}/${schemaMeta.data[datasetChoice].id}`);
    }, [datasetIsConfiged]);

    useEffect(() => {
        if(errorMessage) {
            setOpenSnack(true);
            dispatch(resetUploadDatasetError());
            if (schemaMeta && !schemaMeta.data[datasetChoice].isConfiged ) dispatch(setDatasetIsConfiged(false));
        }
    }, [errorMessage]);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        dispatch(setErrorMessage(null));
        setOpenSnack(false);
    };

    return (
        <div>
            <ThemeProvider theme={mdTheme}>
                {errorMessage &&
                    <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleClose}
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
                                {schemaMeta && <VisControlDatasetSelection setDatasetIsSelected={setDatasetIsSelected} />}
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
                                {schemaMeta && datasetIsSelected && <VisControlDatasetConfig /> }
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </div>
    );
};

export default VisConfigurer;
