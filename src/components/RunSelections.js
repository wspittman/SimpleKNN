import { Checkbox, InputAdornment, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import SplitButton from './SplitButton';

const useStyles = makeStyles((theme) => ({
  paddedLine: {
    ...theme.typography.body1,
    padding: theme.spacing(1),
  },
  inlineNumber: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    width: "100px",
  }
}));

/**
 * The area to select what kind of run to do
 * 
 * Props:
 * trainingDataLength: The length of the training data, or null if an imported model is being used
 * test: (k, percent) => Train on a random % of the data, then test by predicting the remainder of the data using K neighbors
 * 
 * @param {*} props React props
 */
export default function RunSelections(props) {
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [k, setK] = React.useState(null);
  const [isNumericResult, setIsNumericResult] = React.useState(false);
  const [testPercent, setTestPercent] = React.useState(70);
  const classes = useStyles();

  let { trainingDataLength, test } = props;

  // TODO: Predict Option
  const options = ['Test'];

  if (!options.includes(selectedOption)) {
    setSelectedOption(options[0]);
  }

  if (trainingDataLength && !k) {
    // A good starting number based on the available testing data
    let defaultK = Math.floor(Math.sqrt(trainingDataLength * 0.7));
    // Keep the number odd to decrease the chance of ties
    defaultK = defaultK % 2 ? defaultK : defaultK - 1;
    setK(defaultK);
  } 

  return (
    <div className={classes.paddedLine}>
      <span>
        <SplitButton 
          onClick={() => test(k, testPercent, isNumericResult)}
          onSelectionChange={setSelectedOption}
          options={options}
        />

        <TextField
          className={classes.inlineNumber}
          variant="outlined"
          type="number"
          size="small"
          defaultValue={k}
          onChange={event => setK(event.target.value)}
          InputProps={{startAdornment: <InputAdornment position="start">K=</InputAdornment>}}
        />

        <span>
          Train on a random
          <TextField
            className={classes.inlineNumber}
            variant="outlined"
            type="number"
            size="small"
            defaultValue={testPercent}
            onChange={event => setTestPercent(event.target.value)}
            InputProps={{endAdornment: <InputAdornment position="end">%</InputAdornment>}}
          />
          of the data, then test prediction on the remainder. (Treat the result as a numeric range:
          <Checkbox checked={isNumericResult} onChange={event => setIsNumericResult(event.target.checked)} />
          )
        </span>
      </span>
    </div>
  );
}
