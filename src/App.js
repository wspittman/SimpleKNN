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

      results: []
    };
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

  render() {
    return (
      <div className="App">
        <Header 
          setData={(data) => {
            clearClassifier();
            this.setState({data: data});
          }}
        />

        <DataSelections 
          columns={this.state.data[0]}
          example={this.state.data[1]}
          labelIndex={this.state.labelIndex}
          selectedIndices={this.state.selectedIndices}
          setLabelIndex={(index) => {
            clearClassifier();
            this.setState({labelIndex: index});
          }}
          setSelectedIndices={(indices) => {
            clearClassifier();
            this.setState({selectedIndices: indices});
          }}
        />

        <RunSelections 
          test={(k, percent) => testClassifier(this.prepData(), k, percent, results => this.setState({results: results}))}
          classify={(k, values) => runClassifier(this.prepData(), k, values, results => this.setState({results: results}))}
        />

        {this.state.results.map((result, i) => (
          <ResultTable
            key={`ResultTable${i}`}
            content={result}
          />
        ))}
      </div>
    );
  }
}

export default App;
