import React from 'react';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Utils from '../Utils';

const useStyles = makeStyles((theme) => ({
  header: {
    zIndex: theme.zIndex.drawer + 1,
  },
  input: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
}));

/**
 * The header bar
 * 
 * Props (all passed through to HeaderMenu):
 * setTrainingData: (data) => Handle the uploaded training data
 * setModel: (model) => Handle the uploaded KNN model
 * saveModel: () => Download the currently trained KNN model
 * 
 * @param {*} props React props
 */
export default function Header(props) {
  const uploadCSVRef = React.useRef(null);
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.header}>
      <Toolbar>
        <Typography variant="h6" noWrap className={classes.title}>
          SimpleKNN
        </Typography>

        <input
          accept=".csv"
          className={classes.input}
          id="upload-csv-button2"
          type="file"
          onChange={() => Utils.uploadCSV(uploadCSVRef, text => props.setTrainingData(text))}
          ref={uploadCSVRef}
        />

        <label htmlFor="upload-csv-button2">
          <Button variant="outlined" color="inherit" component="span">Upload Data</Button>
        </label>

      </Toolbar>
    </AppBar>
  );
}
