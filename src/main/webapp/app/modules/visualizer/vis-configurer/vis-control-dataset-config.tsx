import React, { useEffect } from "react";
import { useState } from "react";

import { useAppDispatch, useAppSelector } from "app/modules/store/storeConfig";

import SimpleBar from 'simplebar-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TableContainer from "@mui/material/TableContainer";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

import grey from '@mui/material/colors/grey';
import blue from '@mui/material/colors/blue';
import { getColumnNames, updateSchemaInfoColumnNames, setDatasetIsConfiged, getSampleFile, resetSampleFile, resetColumnNames } from "app/modules/store/visualizerSlice";


interface IConfigForm  {
    timeCol: string;
    idCol: string;
    valueCol: string;
}

const defaultForm: IConfigForm = {
    timeCol: '',
    idCol: '',
    valueCol: '',
}


const VisControlDatasetConfig = () => {
    const [ selectedItem, setSelectedItem ] = useState('Denormalized');
    const {schemaMeta, columnNames, datasetChoice, sampleFile} = useAppSelector(state => state.visualizer);
    const [configForm, setConfigForm] = useState<IConfigForm>(defaultForm);
    const {timeCol, idCol, valueCol} = configForm;
    const dispatch = useAppDispatch();


    useEffect(() => {
        dispatch(resetSampleFile());
        dispatch(resetColumnNames());
        schemaMeta && dispatch(getColumnNames({schema: schemaMeta.name, id: schemaMeta.data[datasetChoice].id }));
        schemaMeta && dispatch(getSampleFile(schemaMeta.data[datasetChoice].id));
    },[datasetChoice]);



    const handleButton = (type) => e => {
        setSelectedItem(type);
        setConfigForm(defaultForm);
    }

    const onSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setConfigForm(prevConfigForm => (
            {...prevConfigForm, [name]: value}
        ));
    }

    const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(updateSchemaInfoColumnNames({ schema: schemaMeta.name, id: schemaMeta.data[datasetChoice].id, columns: {timeCol, idCol, valueCol, isConfiged: true}}));
        dispatch(setDatasetIsConfiged(true));
    }

    return (
        <Grid container sx={{height: '100%'}} spacing={1} >
            <Grid item xs={12} sx={{ height: '40%' }}>
                <Grid item sx={{height: '20%'}}>
                    <Typography variant="subtitle1" fontSize={25} sx={{ color: grey[700], mb: 2 }}>Dataset Sample</Typography>
                </Grid >
                <Grid item sx={{height: '80%'}}>
                    <TableContainer 
                        component={Box}
                        sx={{
                            width: '100%',
                            overflowX: 'hidden',
                            overflowY: 'hidden',
                            height: '99%',
                            m: 'auto',
                            border: '1px solid rgb(0,0,0,0.2)',
                        }}
                    >
                        <SimpleBar key="simpleBar-table" style={{ height: '100%' }}>
                            <Table aria-label="simple table" size="small" stickyHeader>
                                <TableHead>
                                    <TableRow key={`table-row-headers`}>
                                        {columnNames.map((col,index) => {
                                            return (<TableCell key={`${col}-${index}-header-cell`} 
                                                sx={{ backgroundColor: blue[800], color: grey[50] }}>{col}</TableCell>);
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sampleFile.map((row, index) => (
                                        <TableRow key={`row-${index}`} >
                                            {row.map((field, index) => (
                                                <TableCell
                                                    key={`${field}-${index}-body-cell`}
                                                    sx={{ bgcolor: grey[50] }}
                                                >
                                                    {field}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </SimpleBar>
                    </TableContainer>
                </Grid>
            </Grid>
            <Grid item xs={12} sx={{ height: '60%' }}>
                <Grid sx={{height: '20%'}}> 
                    <Typography variant="subtitle1" fontSize={25} sx={{ color: grey[700], mb: 1, mt: 2}}>Dataset Configuration</Typography>
                </Grid >
                <Grid sx={{height: '80%'}} >
                    <Grid sx={{ border: '1px solid rgb(0,0,0,0.2)', borderRadius: 4, overflow: 'hidden' }}>
                        <Grid sx={{ bgcolor: blue[800], pb: 2}}>
                            <Typography variant="subtitle1" fontWeight={800} fontSize={20} sx={{ color: grey[200], ml: 3 }}>
                                {schemaMeta.data[datasetChoice].id}
                            </Typography>
                        </Grid>
                        <Grid container spacing={1} sx={{ bgcolor: grey[50]}}>
                            <Grid item container direction="row"   justifyContent="center" alignItems="center" spacing={1}> 
                                <Grid item>
                                    <Button variant={selectedItem === 'Denormalized' ? 'contained' : 'outlined'} onClick={handleButton('Denormalized')} sx={{ borderRadius: 2,}}>
                                        Denormalized Data
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button disabled variant={selectedItem === 'Normalized' ? 'contained' : 'outlined'} onClick={handleButton('Normalized')} sx={{ borderRadius: 2,}}>
                                        Normalized Data
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid container item justifyContent="center" alignItems="center" spacing={1} sx={{mb: 1, display: 'flex' }} component={'form'} onSubmit={handleSubmit}>
                                {selectedItem && (
                                    <Grid item >
                                        <FormControl sx={{ width: '25ch' }} size="small">
                                            <InputLabel id="timeColInput">Time Column</InputLabel>
                                            <Select name="timeCol" labelId="TimeColInput" id="TimeColSelectInput" value={timeCol} label="timeCol" onChange={onSelectChange} required sx={{ borderRadius: 2,}}>
                                                {columnNames.map((col,index) => {
                                                    return (<MenuItem key={index} value={col}>{col}</MenuItem>);
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )}
                                {selectedItem === 'Denormalized' && (
                                    <Grid item >
                                        <FormControl sx={{ width: '25ch' }} size="small">
                                        <InputLabel id="idColInput">Id Column</InputLabel>
                                        <Select name="idCol"labelId="idColInput" id="idColSelectInput" value={idCol} label="idCol" onChange={onSelectChange} required sx={{ borderRadius: 2,}}>
                                            {columnNames.map((col,index) => {
                                                return (<MenuItem key={index} value={col}>{col}</MenuItem>);
                                            })}
                                        </Select>
                                        </FormControl>
                                    </Grid>
                                )}
                                {selectedItem === 'Denormalized' &&  (
                                    <Grid item>
                                        <FormControl sx={{ width: '25ch' }} size="small">
                                        <InputLabel id="valueColInput">Value Column</InputLabel>
                                        <Select name="valueCol" labelId="valueColInput" id="valueColSelectInput" value={valueCol} label="valueCol" onChange={onSelectChange} required sx={{ borderRadius: 2,}}>
                                            {columnNames.map((col,index) => {
                                                return (<MenuItem key={index} value={col}>{col}</MenuItem>);
                                            })}
                                        </Select>
                                        </FormControl>
                                    </Grid>
                                )}
                                {selectedItem && (
                                    <Grid item>
                                        <Button variant="contained" type="submit" sx={{ borderRadius: 2,}}>Confirm</Button>
                                    </Grid>
                                )}                                
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}


export default VisControlDatasetConfig;