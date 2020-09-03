import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';

/**
 * An table to display result data
 * 
 * Props:
 * title: A title line to display above the table
 * columns: An array of column names
 * rows: An array of arrays of values
 * 
 * @param {*} props React props
 */
export default function ResultTable(props) {
  if (!props.columns) return (<div />)

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6">{props.title}</Typography>
      <Table size="small" aria-label="result table">
        <TableHead>
          <TableRow>
            {props.columns.map((column, i) => (
              <TableCell key={`columnHeader${i}`}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, i) => (
            <TableRow key={`resultRow${i}`}>
              {row.map((value, j) => (
                <TableCell key={`resultValue${i}-${j}`}>{value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
