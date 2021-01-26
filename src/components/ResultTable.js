import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  paddedLine: {
    padding: theme.spacing(1),
  },
}));

/**
 * An table to display result data
 * 
 * Props:
 * content: {title, columns, rows}
 * 
 * @param {*} props React props
 */
export default function ResultTable(props) {
  const classes = useStyles();

  if (!props.content) return (<div />)

  let content = props.content;

  let gridCols = [
    { field: 'count', headerName: 'Count', width: 200 },
    { field: 'isCorrect', headerName: 'Correct?', width: 200 },
    { field: 'expected', headerName: 'Actual', width: 200 },
    { field: 'predicted', headerName: 'Predicted', width: 200 },
    { field: 'confidence', headerName: 'Average Confidence', description: 'tooltip', width: 200 },
  ];

  let gridRows = [];
  for (let expected of Object.keys(content)) {
    for (let predicted of Object.keys(content[expected])) {
      let data = content[expected][predicted];

      gridRows.push({
        id: gridRows.length,
        count: data.count,
        isCorrect: expected === predicted,
        expected: expected,
        predicted: predicted,
        confidence: (data.confidences.reduce((sum, val) => sum + val) / data.confidences.length).toFixed(2),
      });
    }
  }

  return (
    <DataGrid class={classes.paddedLine} autoHeight={true} rows={gridRows} columns={gridCols} />
  );
}
