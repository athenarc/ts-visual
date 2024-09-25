import React from "react";
import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import grey from '@mui/material/colors/grey';
import LoginIcon from '@mui/icons-material/Login';
import CircularProgress from '@mui/material/CircularProgress';
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';


import DBFormInput from "./db-form-input";

import { useAppDispatch, useAppSelector } from "app/modules/store/storeConfig";
import { getSchemaMetadata, saveConnection } from '../../store/visualizerSlice';
import { connector } from '../../store/visualizerSlice';
import { IConnection } from "app/shared/model/connection.model";

const defaultForm: IConnection = {
    name: '',
    type: '',
    host: '',
    port: '',
    username: '',
    password: '',
    database: '',
}

const VisConnectorDBConfig = ({closeHandler}) => {
    const { connected, errorMessage } = useAppSelector(state => state.visualizer);
    const dispatch = useAppDispatch();
    const [dbForm, setDbForm] = useState<IConnection>(defaultForm);
    const { name, type, host, port, username, password, database } = dbForm;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (connected) {
            dispatch(getSchemaMetadata({schema: dbForm.database}));
            dispatch(saveConnection(dbForm));
        }
    }, [connected]);

    useEffect(() => {
        setLoading(false);
    }, [errorMessage]);

    

    const handleTextFields = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setDbForm(prevDbForm => (
            {...prevDbForm, [name]: value}
        ));
    }

    const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        dispatch(connector(dbForm));
    }
    
    return (
        <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', rowGap: 1, }}>
            <Typography variant="subtitle1" fontSize={20} sx={{borderBottom: `2px solid ${grey[400]}`}}>
                DB Configuration
            </Typography>
            <form onSubmit={handleSubmit} autoComplete="off">
                <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', rowGap: 1, }}>
                    <FormControl size="small" fullWidth>
                        <InputLabel id="typeInput">DB system * </InputLabel>
                        <Select required labelId="typeInput" id="typeSelectInput" name="type" label="type" value={type} onChange={handleTextFields} sx={{borderRadius: 2,}}>
                            <MenuItem value='postgres'>postgres</MenuItem>
                            <MenuItem value='influx'>influx</MenuItem>
                        </Select>
                    </FormControl>
                    <DBFormInput label="Display Name" name="name" type="text" value={name} handleChange={handleTextFields} />
                    <DBFormInput label='Host' name="host" type='text' value={host} handleChange={handleTextFields} />
                    <DBFormInput label='Port' name="port" type='text' value={port} handleChange={handleTextFields} />
                    {type === "influx" ?  <DBFormInput label='Organization' name="username" type='text' value={username} handleChange={handleTextFields} />
                        : <DBFormInput label='Username' name="username" type='text' value={username} handleChange={handleTextFields} />
                    }
                    {type === "influx" ? <DBFormInput label='Token' name="password" type='password' value={password} handleChange={handleTextFields} />
                        : <DBFormInput label='Password' name="password" type='password' value={password} handleChange={handleTextFields} />
                    }
                    {type === "influx" ? <DBFormInput label='Bucket' name="database" type="text" value={database} handleChange={handleTextFields} />
                        : <DBFormInput label='Database' name="database" type="text" value={database} handleChange={handleTextFields} />
                    }
                    { loading ? <CircularProgress /> : <Button variant="contained" startIcon={<LoginIcon />} type="submit" sx={{borderRadius: 2,}}>Connect </Button> }
                </Box>
            </form> 
            { !loading && (<Button variant="text" startIcon={<CloseIcon />} onClick={closeHandler}>Close</Button>) }
        </Box>
    );
}

export default VisConnectorDBConfig;