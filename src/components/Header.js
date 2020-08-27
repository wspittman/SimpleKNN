import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HeaderMenu from './HeaderMenu';

const useStyles = makeStyles((theme) => ({
  header: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

/**
 * The header bar
 * 
 * Props (all passed through to HeaderMenu):
 * setData(data) => Do what you need to with a new data set
 * knn => The ML5 KNN object
 * 
 * @param {*} props React props
 */
export default function Header(props) {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.header}>
      <Toolbar>
        <HeaderMenu {...props} />
        <Typography variant="h6" noWrap>
          Simple KNNClassifier
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
