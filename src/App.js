import React from 'react';
import Header from './components/Header';
import DataSelections from './components/DataSelections';
import RunSelections from './components/RunSelections';
import ResultTable from './components/ResultTable';
import { clearClassifier, runClassifier, testClassifier } from './Classifier';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      labelIndex: 0,
      selectedIndices: [],
      resultColumns: [],
      resultRows: [],
    };
  }

  prepData() {
    const dataIndices = [];
    this.state.selectedIndices.forEach((val, i) => { if (val) { dataIndices.push(i); } });

    return this.state.data.slice(1).map(row => [row[this.state.labelIndex]].concat(dataIndices.map(i => +row[i])));
  }

  render() {
    return (
      <div className="App">
        <Header 
          setData={(data) => {this.setState({data: data})}}
        />

        <DataSelections 
          columns={this.state.data[0]}
          example={this.state.data[1]}
          labelIndex={this.state.labelIndex}
          selectedIndices={this.state.selectedIndices}
          setLabelIndex={(index) => {this.setState({labelIndex: index})}}
          setSelectedIndices={(indices) => {this.setState({selectedIndices: indices})}}
        />

        <RunSelections 
          test={(k, percent) => testClassifier(this.prepData(), k, percent, result => {
            this.setState({
              resultColumns: result.columns,
              resultRows: result.rows
            });
          })}
          classify={(k, values) => runClassifier(this.prepData(), k, values, result => {
            this.setState({
              resultColumns: result.columns,
              resultRows: result.rows
            });
          })}
        />

        <ResultTable
          columns={this.state.resultColumns}
          rows={this.state.resultRows}
        />
      </div>
    );
  }
}

export default App;
