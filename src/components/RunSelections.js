import React from 'react';
import { InputAdornment, TextField, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
  },
  inlineText: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  }
}));

/**
 * The area to select what kind of run to do
 * 
 * Props:
 * trainingDataLength: The length of the training data, or null if an imported model is being used
 * test: (k, percent) => Train on a random % of the data, then test by predicting the remainder of the data using K neighbors
 * predict: (k, values) => Train on all of the data, then predict for the provided values
 * 
 * @param {*} props React props
 */
export default function RunSelections(props) {
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [k, setK] = React.useState(null);
  const [testPercent, setTestPercent] = React.useState(70);
  const [predictValues, setPredictValues] = React.useState([]);
  const classes = useStyles();

  // Disabled: Predict Option
  const options = ['Test'];
  //const options = props.trainingDataLength ? ['Test', 'Predict'] : ['Predict'];
  const predictMessageStart = props.trainingDataLength ? 'Train on the full data set, then ' : 'Using the imported model, ';

  if (!options.includes(selectedOption)) {
    setSelectedOption(options[0]);
  }

  if (props.trainingDataLength && !k) {
    // A good starting number based on the available testing data
    let defaultK = Math.floor(Math.sqrt(props.trainingDataLength * 0.7));
    // Keep the number odd to decrease the chance of ties
    defaultK = defaultK % 2 ? defaultK : defaultK - 1;
    setK(defaultK);
  } 

  const testDescription = () => {
    return (
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
        of the data, then test prediction on the remainder
      </span>
    )
  };

  const predictDescription = () => {
    return (
      <span>
        {predictMessageStart}
        predict for these comma-separated values:
        
        <TextField
          className={classes.inlineText}
          variant="outlined"
          size="small"
          defaultValue={predictValues}
          onChange={event => setPredictValues(event.target.value.split(',').map(x => +x))}
        />
      </span>
    )
  }

  const submit = () => selectedOption === 'Test' ? props.test(k, testPercent) : props.predict(k, predictValues);

  return (
    <div className={classes.paddedLine}>
      <span>
        <SplitButton onClick={submit} onSelectionChange={setSelectedOption} options={options} />

        <Tooltip title="The number of neighbors to examine when predicting. Larger numbers has less noise, but higher computation times and increased bias from outliers.">
          <TextField
            className={classes.inlineNumber}
            variant="outlined"
            type="number"
            size="small"
            defaultValue={k}
            onChange={event => setK(event.target.value)}
            InputProps={{startAdornment: <InputAdornment position="start">K=</InputAdornment>}}
          />
        </Tooltip>

        {selectedOption === 'Test' ? testDescription() : predictDescription()}
      </span>
    </div>
  );
}
