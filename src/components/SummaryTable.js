import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  table: {
    width: 500,
  },
}));

/**
 * A summary table of the result data
 * 
 * Props:
 * content: { EXPECTED_VAL: { PREDICTED_VAL: { count: N, confidences: [N1, ...]}, ...}, ...}
 * 
 * @param {*} props React props
 */
export default function SummaryTable(props) {
  const classes = useStyles();
  let content = props.content || {};
  let isNumericResult = props.isNumericResult;

  let summary = { count: 0, confSum: 0, diffSum: 0 };
  let matchSummary = { count: 0, confSum: 0, diffSum: 0 };

  for (let expected of Object.keys(content)) {
    for (let predicted of Object.keys(content[expected])) {
      let data = content[expected][predicted];
      let confSum = data.confidences.reduce((sum, val) => sum + val);

      summary.count += data.count;
      summary.confSum += confSum;
      
      if (isNumericResult) {
        summary.diffSum += Math.abs(+expected - +predicted) * data.count
      }

      if (expected === predicted) {
        matchSummary.count += data.count;
        matchSummary.confSum += confSum;

        if (isNumericResult) {
          matchSummary.diffSum += Math.abs(+expected - +predicted) * data.count
        }
      }
    }
  }

  let percent = (x, total) => `${(x / total * 100).toFixed(2)}%`;

  let rows = [
    ['Count', summary.count, matchSummary.count, summary.count - matchSummary.count],
    ['% of Total', '100%', percent(matchSummary.count, summary.count), percent(summary.count - matchSummary.count, summary.count)],
    ['Avg Confidence', percent(summary.confSum, summary.count), percent(matchSummary.confSum, matchSummary.count), percent(summary.confSum - matchSummary.confSum, summary.count - matchSummary.count)]
  ];

  if (isNumericResult) {
    rows.push(['Avg Difference', (summary.diffSum / summary.count).toFixed(2), (matchSummary.diffSum / matchSummary.count), ((summary.diffSum - matchSummary.diffSum) / (summary.count - matchSummary.count)).toFixed(2)]);
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small" className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>All Test Rows</TableCell>
            <TableCell>Predicted Correctly</TableCell>
            <TableCell>Predicted Incorrectly</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={`row${i}`}>
              {row.map((value, i) => (<TableCell key={`cell${i}`}>{value}</TableCell>))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
