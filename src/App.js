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

      resulteTitle: '',
      resultColumns: [],
      resultRows: [],
    };

    this.setResultState = this.setResultState.bind(this);
  }

  prepData() {
    // Translate the bool[] to a shorter int[]
    const dataIndices = this.state.selectedIndices.map((val, i) => val ? i : null)
                                                  .filter(x => x != null);

    // Return the data in the format [[label, data1, ...], ...]
    return this.state.data.slice(1)
                          // For each row, create an array with the label
                          .map(row => [row[this.state.labelIndex]]
                          // Then append all the data values, coerced back into numbers
                          .concat(dataIndices.map(i => +row[i])));
  }

  setResultState(result) {
    this.setState({
      resultTitle: result.title,
      resultColumns: result.columns,
      resultRows: result.rows
    });
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
          test={(k, percent) => testClassifier(this.prepData(), k, percent, this.setResultState)}
          classify={(k, values) => runClassifier(this.prepData(), k, values, this.setResultState)}
        />

        <ResultTable
          title={this.state.resultTitle}
          columns={this.state.resultColumns}
          rows={this.state.resultRows}
        />
      </div>
    );
  }
}

export default App;
