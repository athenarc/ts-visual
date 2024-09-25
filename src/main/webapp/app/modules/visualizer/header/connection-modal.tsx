import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import grey from '@mui/material/colors/grey';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  px: 2,
  py: 1,
  display: 'flex',
  flexDirection: 'column',
  rowGap: 1,
};

const influxInfo = {
  url: "",
  port: "",
  token: "",
  org: "",
  bucket: "",
};

const postgreSQL = {
  url: "",
  port: "",
  username: "",
  password: "",
};

const modelarDB = {
  url: "",
  port: "",
};

const ConnectionModal = props => {
  const { conModal, setConModal, menuChoice, setMenuChoice, keepChoice } = props;
  const [dbConfig, setDbConfig] = useState({});

  const handleConModalClose = () => {
    setConModal(false);
  };

  const handleTextFields = key => e => {
    setDbConfig(state => ({...state, [key]: e.target.value}))
  }

  const checkInputs = () => {
    return Object.values(dbConfig).every((val: string) => val.length !== 0 );
  }

  const handleConnect = () => {
    setMenuChoice(keepChoice);
    setConModal(false);
  }

  useEffect(() => {
    if (keepChoice === 'PostgreSQL') {
      setDbConfig({ ...postgreSQL });
    } else if (keepChoice === 'InfluxDB') {
      setDbConfig({ ...influxInfo });
    } else {
      setDbConfig({ ...modelarDB });
    }
  }, [keepChoice]);

  return (
    <>
    <Modal open={conModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Box>
          <Typography id={`modal-title`} variant="subtitle1" sx={{ borderBottom: `1px solid ${grey[600]}` }} fontSize={20}>
            Connection Configuration
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 2 }}>
          {Object.keys(dbConfig).map(key => (
            <Box key={`modal-key-${key}`} sx={{ display: 'flex', alignItems: 'center', columnGap: 2, width: '100%' }}>
              <Box sx={{width: "30%", textAlign: "center"}}>
                <Typography variant="subtitle1">
                  {`${key}:`}
                </Typography>
              </Box>
              <Box sx={{width: "70%"}}>
                <TextField required id="outlined-required" label="" size="small" onChange={handleTextFields(key)} fullWidth/>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'end', columnGap: 1, borderTop: `1px solid ${grey[600]}`, pt: 1 }}>
          <Button variant="contained" disabled={!checkInputs()} onClick={handleConnect}>Connect</Button>
          <Button variant="contained" color="error" onClick={handleConModalClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
    </>
  );
};

export default ConnectionModal;
