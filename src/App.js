import React from 'react';
import Header from './components/Header';
import DataSelections from './components/DataSelections';
import IntroMessage from './components/IntroMessage';
import RunSelections from './components/RunSelections';
import ResultTable from './components/ResultTable';
import Classifier from './Classifier';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      knnType: null,

      trainingData: [],

      labelIndex: 0,
      selectedIndices: [],

      results: []
    };
  }

  setModel(model) {
    Classifier.clear();
    Classifier.load(model);
    this.setState({knnType: 'model'});
  }

  trainingDataUpdate(stateObject) {
    Classifier.clear();
    this.setState(stateObject);
  }

  prepData() {
    // Translate the bool[] to a shorter int[]
    const dataIndices = this.state.selectedIndices.map((val, i) => val ? i : null)
                                                  .filter(x => x != null);

    // Return the data in the format [[label, data1, ...], ...]
    return this.state.trainingData.slice(1)
                          // For each row, create an array with the label
                          .map(row => [row[this.state.labelIndex]]
                          // Then append all the data values, coerced back into numbers
                          .concat(dataIndices.map(i => +row[i])));
  }

  createDataSelectionArea() {
    if (this.state.knnType === 'data') {
      return (
        <DataSelections 
          columns={this.state.trainingData[0]}
          example={this.state.trainingData[1]}
          labelIndex={this.state.labelIndex}
          selectedIndices={this.state.selectedIndices}
          setLabelIndex={index => this.trainingDataUpdate({labelIndex: index})}
          setSelectedIndices={indices => this.trainingDataUpdate({selectedIndices: indices})}
        />
      );
    } else {
      return (
        <IntroMessage content={this.state.knnType === 'model' ? 'A model has been loaded' : null} />
      );
    }
  }

  createRunSelectionArea() {
    if (this.state.knnType) {
      return (
        <RunSelections 
          trainingDataLength={this.state.knnType === 'data' && this.state.trainingData.length}
          test={(k, percent) => Classifier.test(this.prepData(), k, percent, results => this.setState({results: results}))}
          classify={(k, values) => Classifier.run(this.prepData(), k, values, results => this.setState({results: results}))}
        />
      );
    } else {
      return (<div />);
    }
  }

  render() {
    return (
      <div className="App">
        <Header 
          setTrainingData={data => this.trainingDataUpdate({trainingData: data, knnType: 'data'})}
          setModel={model => this.setModel(model)}
          saveModel={() => Classifier.save()}
        />

        {this.createDataSelectionArea()}
        {this.createRunSelectionArea()}

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
