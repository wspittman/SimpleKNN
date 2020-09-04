import React from 'react';
import { Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paddedLine: {
    padding: theme.spacing(1),
    maxWidth: 800,
  },
}));

/**
 * A introductory message area
 * 
 * Props:
 * content: A message to display, or null to display the full introduction message
 * 
 * @param {*} props React props
 */
export default function Message(props) {
  const classes = useStyles();

  if (props.content) {
    return (
      <Typography className={classes.paddedLine}>{props.content}</Typography>
    );
  }

  return (
    <div className={classes.paddedLine}>
      <Typography className={classes.paddedLine}>
        {'Simple KNNClassifier is a no-code tool allowing those without a machine learning background to experiment using their existing CSV data and the '}
        <Link href="https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm">K-Nearest Neighbors</Link>
        {' (KNN) machine learning algorithm'}
      </Typography>
      <Typography className={classes.paddedLine}>
        To get started, use the menu to upload a CSV (or import an existing KNN model)
      </Typography>
      <Typography className={classes.paddedLine}>
        Note: All processing happens in your browser, the data you upload never leaves your computer
      </Typography>

      <Typography className={classes.paddedLine}>
        {'This tool is built using the KNNClassifier of the '}
        <Link href="https://ml5js.org/">ML5.js library</Link>
      </Typography>

      <Typography className={classes.paddedLine}>
        {'The code can be found in the '}
        <Link href="https://github.com/wspittman/SimpleKNN.git">SimpleKNN Github Repository</Link>
      </Typography>
    </div>
  );
}