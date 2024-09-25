import React from "react";
import { useState } from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton';
import  InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type DBFormPropsType = {
    label: string;
    name: string;
    value: string;
    type: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


const DBFormInput = ({label, name, value, type, handleChange}: DBFormPropsType ) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
    <Box sx={{ display: 'flex',flexDirection: 'column' ,alignItems: 'center', columnGap: 4, width: '100%',  }}>
        { name === 'password' ? (
            <TextField 
            variant="outlined"
            required
            label={label}
            size="small" 
            fullWidth 
            value={value} 
            name={name} 
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            InputProps={{ sx: {borderRadius: 2}, endAdornment: (
                <InputAdornment position="end">
                <IconButton
                    tabIndex={-1}
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )        
            }}
            />
        ) :
        (
        <TextField 
            variant="outlined"
            required
            label={label}
            hiddenLabel 
            size="small" 
            fullWidth 
            value={value} 
            name={name} 
            onChange={handleChange}
            type={type}
            InputProps={{ sx: {borderRadius: 2}}}
        />
        )}
    </Box>
    )

}

export default DBFormInput;