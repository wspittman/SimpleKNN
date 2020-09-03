import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from '@material-ui/core';

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
  const [orderBy, setOrderBy] = React.useState(null);
  const [order, setOrder] = React.useState('asc');

  if (!props.columns) return (<div />)

  const stableSort = (rows) => {
    console.log('stablesort');
    const stabilizedThis = rows.map((row, index) => [row, index]);
    stabilizedThis.sort((a, b) => {
      let compare = order === 'asc' ? a[0][orderBy] - b[0][orderBy] : b[0][orderBy] - a[0][orderBy];
      if (compare !== 0) return compare;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6">{props.title}</Typography>
      <Table size="small" aria-label="result table">
        <TableHead>
          <TableRow>
            {props.columns.map((column, i) => (
              <TableCell 
                key={`columnHeader${i}`}
                sortDirection={orderBy === i ? order : false}
              >
                <TableSortLabel
                  active={orderBy === i}
                  direction={orderBy === i ? order : 'asc'}
                  onClick={() => {
                    let isAsc = orderBy === i && order === 'asc';
                    setOrder(isAsc ? 'desc' : 'asc');
                    setOrderBy(i);
                  }}
                >
                  {column}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {stableSort(props.rows).map((row, i) => (
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
