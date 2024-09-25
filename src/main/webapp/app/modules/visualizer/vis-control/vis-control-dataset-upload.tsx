import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Papa from 'papaparse';
import TableContainer from '@mui/material/TableContainer';
import SimpleBar from 'simplebar-react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/modules/store/storeConfig';
import { setLoadingButton, uploadDataset } from 'app/modules/store/fileManagementSlice';
import { CircularProgressWithLabel } from 'app/modules/visualizer/vis-configurer/circular-progress';
import grey from '@mui/material/colors/grey';
import blue from '@mui/material/colors/blue';
import red from '@mui/material/colors/red';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 10,
  width: 980,
  p: 3,
  height: 800,
  backgroundColor: grey[50],
};

const inputSx = {
  color: grey[700],
  bgcolor: grey[400],
  width: '150px',
  textAlign: 'center',
  height: '38px',
  display: 'inline-grid',
  alignItems: 'center',
  borderRadius: '20px',
};

interface IVisUploadDataset {
  uploadModalOpen: boolean;
  setUploadModalOpen: Dispatch<SetStateAction<any>>;
  uploadFile: any;
  setUploadFile: Dispatch<SetStateAction<any>>;
}

interface metaSchema {
  id: string;
  path: string;
  name: string;
  type: "CSV" | "PARQUET";
  hasHeader: boolean;
  timeCol: number;
  measures: number[];
}

const VisControlDatasetUpload = (props: IVisUploadDataset) => {
  const { uploadModalOpen, setUploadModalOpen, uploadFile, setUploadFile } = props;
  const { loadingButton, uploadState } = useAppSelector(state => state.fileManagement);
  const dispatch = useAppDispatch();
  const [csvSample, setCsvSample] = useState(null);
  const [formData, setFormData] = useState<metaSchema>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const params: any = useParams();

  const handleInputChanges = (property: string) => e => {
    if (property === 'hasHeader') {
      setFormData(prev => ({ ...prev, [property]: !prev[property] }));
    } else if (property === 'timeCol') {
      setFormData(prev => ({
        ...prev,
        [property]: e.target.value,
        measures: csvSample.meta.fields.map((f, idx) => idx).filter(val => val !== e.target.value),
      }));
    } else {
      setFormData(prev => ({ ...prev, [property]: e.target.value }));
    }
  };

  const handleOnCloseModal = () => {
    setUploadModalOpen(prev => !prev);
    setUploadFile(null);
  };

  const handleTableLoading = () => {
    Papa.parse(uploadFile[0], {
      header: true,
      skipEmptyLines: true,
      preview: 20,
      dynamicTyping: true,
      complete: function (results) {
        setCsvSample(results);
        setDataLoading(false);
      },
    });
  };

  const checkCellInfo = number => {
    if (!isNaN(number)) {
      return Number.parseFloat(number).toFixed(2);
    } else {
      return number;
    }
  };

  useEffect(() => {
    handleTableLoading();
  }, []);

  const formValidation = () => {
    return Object.values(formData).some(val => val === '');
  };

  const handleUploadButton = e => {
    if (formValidation()) {
      setError(true);
    } else {
      dispatch(setLoadingButton(true));
      setError(false);
      const data = new FormData();
      data.append('file', uploadFile[0]);
      data.append('meta', JSON.stringify(formData));
      data.append('schemaName', params.schema);
      dispatch(uploadDataset(data));
    }
  };

  useEffect(() => {
    csvSample &&
      setFormData({
        id: uploadFile[0].name.replace(".csv", ""),
        path: uploadFile[0].name,
        type: "CSV",
        name: '',
        hasHeader: true,
        timeCol: 0,
        measures: csvSample.meta.fields.map((f, idx) => idx).filter(val => val !== 0),
      });
  }, [csvSample]);

  return (
    <>
      <Modal
        open={uploadModalOpen}
        onClose={handleOnCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid container sx={{ height: '100%' }}>
            {!dataLoading ? (
              <>
                <Grid item xs={12} sx={{ height: '40%' }}>
                  <Grid sx={{ height: '20%' }}>
                    <Typography variant="subtitle1" fontSize={25} sx={{ color: grey[700], mb: 2 }}>
                      File Sample
                    </Typography>
                  </Grid>
                  <Grid sx={{ height: '80%' }}>
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
                              {csvSample.meta.fields.map((f, idx) => (
                                <TableCell
                                  key={`${f}-${idx}-header-cell`}
                                  align={idx === 0 ? 'left' : 'right'}
                                  sx={{ backgroundColor: blue[800], color: grey[50] }}
                                >
                                  {f}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {csvSample.data.map((row, idx) => (
                              <TableRow key={`row-${idx}`}>
                                {csvSample.meta.fields.map((field, idx) => (
                                  <TableCell
                                    key={`${field}-${idx}-body-cell`}
                                    align={idx === 0 ? 'left' : 'right'}
                                    sx={{ bgcolor: grey[50] }}
                                  >
                                    {checkCellInfo(row[field])}
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
                <Grid item xs={12} sx={{ height: '50%' }}>
                  <Grid sx={{ height: '20%', display: 'flex' }}>
                    <Typography variant="subtitle1" fontSize={25} sx={{ color: grey[700], mb: 2, mt: 2, flex: 1 }}>
                      Dataset Configuration
                    </Typography>
                    {error && (
                      <Typography variant="subtitle1" fontWeight={800} fontSize={17} sx={{ color: red[600], alignSelf: 'center', mr: 2 }}>
                        {'Fill the required fields!'}
                      </Typography>
                    )}
                  </Grid>
                  <Grid sx={{ height: '80%' }}>
                    <Grid sx={{ border: '1px solid rgb(0,0,0,0.2)', borderRadius: 4, overflow: 'hidden', mt: 2 }}>
                      <Grid sx={{ backgroundColor: blue[800] }}>
                        <Typography variant="subtitle1" fontWeight={800} fontSize={20} sx={{ color: grey[200], ml: 3 }}>
                          {uploadFile[0].name}
                        </Typography>
                      </Grid>
                      <Grid sx={{ p: 3, backgroundColor: grey[50] }}>
                        <Grid sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight={800} sx={inputSx}>
                            *ID:
                          </Typography>
                          <FormControl variant="standard" sx={{ m: 1, width: '15ch' }} disabled>
                            <Input
                              id={`standard-adornment-weight-${uploadFile[0].name}`}
                              aria-describedby="standard-weight-helper-text"
                              inputProps={{
                                'aria-label': 'weight',
                              }}
                              onChange={handleInputChanges('id')}
                              value={formData.id}
                            />
                          </FormControl>
                          <Typography variant="subtitle1" fontWeight={800} sx={inputSx}>
                            Type:
                          </Typography>
                          <FormControl sx={{ m: 1, width: '20ch' }} size="small">
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={formData.type}
                              onChange={handleInputChanges('type')}
                            >
                                <MenuItem key="Csv-menu-item" value={"CSV"}>
                                CSV
                                </MenuItem>
                                <MenuItem key="Parquet-menu-item" value={"PARQUET"}>
                                Parquet
                                </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight={800} sx={inputSx}>
                            *Name:
                          </Typography>
                          <FormControl variant="standard" sx={{ m: 1, width: '15ch' }}>
                            <Input
                              id="standard-adornment-weight"
                              aria-describedby="standard-weight-helper-text"
                              inputProps={{
                                'aria-label': 'weight',
                              }}
                              onChange={handleInputChanges('name')}
                              value={formData.name}
                            />
                          </FormControl>
                          <Typography variant="subtitle1" fontWeight={800} sx={inputSx}>
                            Has Header:
                          </Typography>
                          <Checkbox checked={formData.hasHeader} onChange={handleInputChanges('hasHeader')} />
                        </Grid>
                        <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" fontWeight={800} sx={inputSx}>
                            DateTime Column:
                          </Typography>
                          <FormControl sx={{ m: 1, width: '20ch' }} size="small">
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={formData.timeCol}
                              onChange={handleInputChanges('timeCol')}
                            >
                              {csvSample.meta.fields.map((field, idx) => (
                                <MenuItem key={`${field}-${idx}-${uploadFile[0].name}`} value={idx}>
                                  {idx}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90%', flexDirection: 'column' }}
              >
                <Typography variant="subtitle1" fontSize={25} sx={{ color: grey[700], mb: 2, mt: 2 }}>
                  Loading File...
                </Typography>
                <CircularProgress disableShrink />
              </Grid>
            )}
            <Grid item xs={12} sx={{ height: '10%', textAlign: 'center' }}>
              {loadingButton ? <CircularProgressWithLabel value={uploadState} /> :
              <Button variant="contained" disabled={dataLoading} onClick={handleUploadButton}>
                upload
              </Button>}
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default VisControlDatasetUpload;
