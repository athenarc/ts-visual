import React, { useEffect } from "react"
import { useState } from "react";

import Button from "@mui/material/Button";
import StorageIcon from '@mui/icons-material/Storage';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Box from "@mui/material/Box";
import grey from '@mui/material/colors/grey';
import Tooltip from "@mui/material/Tooltip";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { createTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from "@mui/material/CircularProgress";
import VisConnectorDBConfig from "./vis-connector-db-config";
import { useAppDispatch, useAppSelector } from "app/modules/store/storeConfig";
import { connector, getSchemaMetadata, deleteConnection, getAllConnections, disconnector } from "app/modules/store/visualizerSlice";
import { IConnection } from "app/shared/model/connection.model";

const mdTheme = createTheme();

const VisConnector = () => {
    const [ step, setStep ] = useState(false);
    const {connections, connected, loading} = useAppSelector(state => state.visualizer);
    const [connectionInfo, setConnectionInfo] = useState<IConnection>(null);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getAllConnections());
        // dispatch(disconnector({}));
    },[]);

    useEffect(() => {
        if(connected && connectionInfo)
            dispatch(getSchemaMetadata({schema: connectionInfo.database}));
    },[connected])

    const closeHandler = () => {
        setStep(false);
    }

    const getLoadingStatus = () => {
        return loading;
    }

    return (
        <>
        {!step && (
            <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', rowGap: 1 }}>
                {connections.length !== 0 && (
                    <Typography variant="subtitle1" fontSize={20} sx={{ borderBottom: `2px solid ${grey[400]}`}}>
                        Available Data Sources
                    </Typography>
                )}
                {!loading ? connections.map(connection => 
                        ( <Grid container key={connection.name} sx={{display: 'flex', flexDirection: 'row', [mdTheme.breakpoints.down('sm')]: {flexDirection: 'column'}}}>
                            <Grid item sm={8}>
                                <Button variant="text" component="label"  sx={{borderRadius: 2}} onClick={() => {
                                    setConnectionInfo(connection);
                                    dispatch(connector(connection));                
                                }}>{connection.name}</Button>
                            </Grid>
                            <Grid item>
                                <Tooltip title="delete" disableInteractive> 
                                    <Button startIcon={<DeleteIcon />} onClick={() => {
                                        dispatch(deleteConnection(connection.name));
                                    }} ></Button>
                                </Tooltip>
                            </Grid>
                        </Grid>
                        )
                    ) : <CircularProgress/>
                }
                <Typography variant="subtitle1" fontSize={20} sx={{ borderBottom: `2px solid ${grey[400]}`}}>
                    New Data Source
                </Typography>
                <Button disabled={getLoadingStatus()} variant="contained" sx={{borderRadius: 2, }} startIcon={<StorageIcon />} onClick={() => {setStep(true);}}>
                    <Typography sx={{[mdTheme.breakpoints.down('md')]: {display: 'none'},}} > Database </Typography>
                </Button>
                <Button disabled variant="contained"  sx={{borderRadius: 2,}} startIcon={<UploadFileIcon/>}>
                    <Typography sx={{[mdTheme.breakpoints.down('md')]: {display: 'none'},}} > FileSystem </Typography>
                </Button>
            </Box>
        )}
        { step && (
            <VisConnectorDBConfig closeHandler={closeHandler} />
        )}
        </>
    );
}

export default VisConnector;