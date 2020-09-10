import React from 'react';
import { Checkbox, Paper, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  firstColumn: {
    width: 50,
  },
}));

/**
 * The area to select which parts of the data to use
 * 
 * Props:
 * columns: An array of column names
 * example: An array of values for an example row
 * labelIndex: The index of the column currently used as the ML label
 * selectedIndices: An array of truthy values to indicate indices selected for use as data in the classifier
 * setIndices: (labelIndex, selectedIndices) => Update the label index and index selection
 * 
 * @param {*} props React props
 */
export default function DataSelections(props) {
  const classes = useStyles();
  const labelRadios = [];
  const dataCheckboxes = [];

  let { columns, example, labelIndex, selectedIndices } = props;
  let { setIndices } = props;

  const onChange = (event) => {
    let newIndex = +event.target.value;
    let isChecked = event.target.checked;
    let isLabel = event.target.type === 'radio';

    if (isLabel) {
      labelIndex = newIndex;
      selectedIndices[newIndex] = false;
    } else {
      labelIndex = (isChecked && newIndex === labelIndex) ? null : labelIndex;
      selectedIndices[newIndex] = isChecked;
    }

    setIndices(labelIndex, selectedIndices);
  }

  for (let i = 0; i < columns.length; i++) {
    labelRadios.push(<TableCell padding="checkbox" key={`LabelRadio${i}`}><Radio value={i} checked={labelIndex === i} onChange={onChange}/></TableCell>)
    dataCheckboxes.push(<TableCell padding="checkbox" key={`DataCheckbox${i}`}><Checkbox value={i} checked={!!selectedIndices[i]} onChange={onChange}/></TableCell>)
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="data selection table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.firstColumn} />
            {columns.map((column, i) => (
              
                <TableCell key={`columnHeader${i}`}>{column}</TableCell>
              
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <Tooltip title="An example row from the data">
              <TableCell component="th" scope="row">Example</TableCell>
            </Tooltip>
            {example.map((value, i) => (
              <TableCell key={`columnValue${i}`}>{value}</TableCell>
            ))}
          </TableRow>

          <TableRow>
            <Tooltip title="Select any columns that should be used as training inputs. These must be numbers."> 
              <TableCell component="th" scope="row">Training Data</TableCell>
            </Tooltip>
            {dataCheckboxes}
          </TableRow>

          <TableRow>
            <Tooltip title="Select that column that is the 'result'. It should be a discrete set: colors, letter grades, buy/sell/hold, etc."> 
              <TableCell component="th" scope="row">Result</TableCell>
            </Tooltip>
            {labelRadios}
          </TableRow>
            
        </TableBody>
      </Table>
    </TableContainer>
  );
}
