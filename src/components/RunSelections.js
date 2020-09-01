import React from 'react';
import { InputAdornment, TextField } from '@material-ui/core';
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
 * test: (k, percent) => Train on a random % of the data, then test by classifying the remainder of the data using K neighbors
 * classify: (k, values) => Train on all of the data, then classify the provided values
 * 
 * @param {*} props React props
 */
export default function RunSelections(props) {
  const [selectedOption, setSelectedOption] = React.useState("Test");
  const [k, setK] = React.useState(3);
  const [testPercent, setTestPercent] = React.useState(70);
  const [classifyValues, setClassifyValues] = React.useState([]);
  const classes = useStyles();

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
        of the data, then test classification on the remainder
      </span>
    )
  };

  const classifyDescription = () => {
    return (
      <span>
        Train on the full data set, then classify these comma-separated values:
        <TextField
          className={classes.inlineText}
          variant="outlined"
          size="small"
          defaultValue={classifyValues}
          onChange={event => setClassifyValues(event.target.value.split(',').map(x => +x))}
        />
      </span>
    )
  }

  const submit = (option) => selectedOption === "Test" ? props.test(k, testPercent) : props.classify(k, classifyValues);

  return (
    <div className={classes.paddedLine}>
      <span>
        <SplitButton onClick={submit} onSelectionChange={setSelectedOption} options={["Test", "Classify"]} />

        <TextField
          className={classes.inlineNumber}
          variant="outlined"
          type="number"
          size="small"
          defaultValue={k}
          onChange={event => setK(event.target.value)}
          InputProps={{startAdornment: <InputAdornment position="start">K=</InputAdornment>}}
        />

        {selectedOption === "Test" ? testDescription() : classifyDescription()}
      </span>
    </div>
  );
}
