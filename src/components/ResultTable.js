import { makeStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  paddedLine: {
    padding: theme.spacing(1),
  },
}));

/**
 * A data grid to display result data
 * 
 * Props:
 * content: { EXPECTED_VAL: { PREDICTED_VAL: { count: N, confidences: [N1, ...]}, ...}, ...}
 * 
 * @param {*} props React props
 */
export default function ResultTable(props) {
  const classes = useStyles();
  let content = props.content || {};

  let columns = [
    { field: 'count', headerName: 'Count', type: 'number', width: 125 },
    { field: 'isCorrect', headerName: 'Match', width: 125 },
    { field: 'expected', headerName: 'Actual', width: 150 },
    { field: 'predicted', headerName: 'Predicted', width: 150 },
    { field: 'confidence', headerName: 'Confidence (avg)', type: 'number', width: 200, description: 'tooltip' },
  ];

  let rows = [];
  for (let expected of Object.keys(content)) {
    for (let predicted of Object.keys(content[expected])) {
      let data = content[expected][predicted];

      rows.push({
        id: rows.length,
        count: data.count,
        isCorrect: expected === predicted,
        expected: expected,
        predicted: predicted,
        confidence: (data.confidences.reduce((sum, val) => sum + val) / data.confidences.length).toFixed(2),
      });
    }
  }

  return (
    <DataGrid 
      class={classes.paddedLine}
      autoHeight={true}
      rows={rows}
      columns={columns}
      sortModel={[{
        field: 'count',
        sort: 'desc'
      }]}
    />
  );
}
