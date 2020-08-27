import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HeaderMenu from './HeaderMenu';

const useStyles = makeStyles((theme) => ({
  header: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

function Header(props) {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.header}>
      <Toolbar>
        <HeaderMenu 
          setData={(e) => console.log(e)}
          knn={props.knn}
        />
        <Typography variant="h6" noWrap>
          Simple KNNClassifier
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
