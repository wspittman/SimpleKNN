import { Box, CircularProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  paddedLine: {
    padding: theme.spacing(1),
  },
}));

/**
 * A progress circle, with percentage and label
 * 
 * Props:
 * label: A label indicating what is being waited on
 * value: A 0..1 value indicating the current progress percentage
 * 
 * @param {*} props React props
 */
export default function ProgressCircle(props) {
  const classes = useStyles();

  const { label, value } = props;

  return (
    <div className={classes.paddedLine}>
      <Box className={classes.paddedLine} position="relative" display="inline-flex">
        <CircularProgress variant="determinate" value={value * 100} />

        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">{`${Math.floor(value * 100)}%`}</Typography>
        </Box>

        <Box
          left={0}
          bottom={-10}
          right={0}
          position="absolute"
          display="flex"
          justifyContent="center"
        >
          <Typography variant="caption" component="div" color="textSecondary">{label}</Typography>
        </Box>
      </Box>
    </div>
  );
}
