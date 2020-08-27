import React from 'react';
import { Checkbox, Radio } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// So we don't actually need the full dataset to be passed in, just the first two rows
// props
// columns
// exampleRow
// onChange
export default function DataSelections(props) {
  if (!props.columns) return <div></div>

  const labelRadios = [];
  const dataCheckboxes = [];

  for (let i = 0; i < props.columns.length; i++) {
    labelRadios.push(<TableCell padding="checkbox" ><Radio /></TableCell>)
    dataCheckboxes.push(<TableCell padding="checkbox" ><Checkbox /></TableCell>)
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="data selection table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {props.columns.map(column => (
              <TableCell>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">Example</TableCell>
            {props.example.map(value => (
              <TableCell>{value}</TableCell>
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
