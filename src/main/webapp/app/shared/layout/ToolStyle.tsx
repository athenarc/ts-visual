import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  infoBox: {border: "1px solid grey", boxShadow: "0 0 5px #8798ad", borderRadius: 5, borderColor: "#8798ad"},
  formControlMulti: {
    margin: theme.spacing(1),
    width: 200
  },
}));


const ToolStyles = () => {
  return useStyles();
};

export default ToolStyles;
