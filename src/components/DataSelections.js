import React from 'react';
import { Checkbox, Paper, Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

/**
 * The area to select which parts of the data to use
 * 
 * Props:
 * columns: An array of column names
 * example: An array of values for an example row
 * labelIndex: The index of the column currently used as the ML label
 * selectedIndices: An array of truthy values to indicate indices selected for use as data in the classifier
 * setLabelIndex: (index) => Update the label index
 * setSelectedIndices: (indices) => Update the index selection
 * 
 * @param {*} props React props
 */
export default function DataSelections(props) {
  if (!props.columns) return (<div />)

  const labelRadios = [];
  const dataCheckboxes = [];

  const onChange = (event) => {
    if (event.target.type === 'radio') {
      props.setLabelIndex(+event.target.value);
    } else {
      props.selectedIndices[+event.target.value] = event.target.checked;
      props.setSelectedIndices(props.selectedIndices);
    }
  }

  for (let i = 0; i < props.columns.length; i++) {
    labelRadios.push(<TableCell padding="checkbox" key={`LabelRadio${i}`}><Radio value={i} checked={props.labelIndex === i} onChange={onChange}/></TableCell>)
    dataCheckboxes.push(<TableCell padding="checkbox" key={`DataCheckbox${i}`}><Checkbox value={i} onChange={onChange}/></TableCell>)
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="data selection table">
        <TableHead>
          <TableRow>
            <TableCell />
            {props.columns.map((column, i) => (
              <TableCell key={`columnHeader${i}`}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">Example</TableCell>
            {props.example.map((value, i) => (
              <TableCell key={`columnValue${i}`}>{value}</TableCell>
            ))}
          </TableRow>

          <TableRow>
            <TableCell component="th" scope="row">Use as Label</TableCell>
            {labelRadios}
          </TableRow>
            
          <TableRow>
            <TableCell component="th" scope="row">Use as Data</TableCell>
            {dataCheckboxes}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
