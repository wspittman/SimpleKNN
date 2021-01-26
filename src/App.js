import React from 'react';
import Classifier from './Classifier';
import DataSelections from './components/DataSelections';
import ErrorMessage from './components/ErrorMessage';
import Header from './components/Header';
import Markdown from './components/Markdown';
import ProgressCircle from './components/ProgressCircle';
import ResultTable from './components/ResultTable';
import RunSelections from './components/RunSelections';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      knnType: null,

      trainingData: [],

      labelIndex: null,
      selectedIndices: [],

      results: null,

      progressValue: 0,
      progressLabel: null,

      errorMessage: null,
      displayError: false,
    };

    this.setProgress = this.setProgress.bind(this);
    this.setModel = this.setModel.bind(this);
    this.setTrainingData = this.setTrainingData.bind(this);
    this.setResults = this.setResults.bind(this);
  }

  componentDidMount() {
    const readmePath = require('./Help.md');
    fetch(readmePath)
      .then(response => response.text())
      .then(text => { this.setState({helpMarkdown: text})});
  }

  setError(message) {
    this.setState({
      errorMessage: message,
      displayError: true,
    });
  }

  setProgress(stage, value) {
    this.setState({
      progressLabel: stage,
      progressValue: value
    });
  }
  
  setResults(results) {
    this.setState({
      progressLabel: null,
      results: results
    });
  }

  setModel(model) {
    if (!model) {
      this.setError('Could not parse model. Are you sure it is in JSON format?');
      return;
    }

    Classifier.clear();

    Classifier.load(model, error => {
      if (error) this.setError('Could not parse model. Are you sure it was created by ML5 KNN?');
      else this.setState({knnType: 'model'});
    });
  }

  setTrainingData(data) {
    if (!data ||
        !Array.isArray(data[0]) || 
        !Array.isArray(data[1])) {
      this.setError('Could not parse training data. Are you sure it is a CSV with a header row?');
      return;
    }

    this.trainingDataUpdate({
      trainingData: data,
      knnType: 'data',
      labelIndex: null,
      selectedIndices: []
    });
  }
  
  trainingDataUpdate(stateObject) {
    Classifier.clear();
    this.setState(stateObject);
  }

  prepData(sendData) {
    if (!this.state.selectedIndices.length) return this.setError('No input columns selected');
    if (this.state.labelIndex == null) return this.setError('No result column selected');

    // Translate the bool[] to a shorter int[]
    const dataIndices = this.state.selectedIndices.map((val, i) => val ? i : null)
                                                  .filter(x => x != null);

    // Return the data in the format [[label, data1, ...], ...]
    sendData(this.state.trainingData.slice(1)
                       // For each row, create an array with the label
                       .map(row => [row[this.state.labelIndex]]
                       // Then append all the data values, coerced back into numbers
                       .concat(dataIndices.map(i => +row[i]))));
  }

  createDataSelectionArea() {
    if (this.state.knnType === 'data') {
      return (
        <DataSelections 
          columns={this.state.trainingData[0]}
          example={this.state.trainingData[1]}
          labelIndex={this.state.labelIndex}
          selectedIndices={this.state.selectedIndices}
          setIndices={(labelIndex, selectedIndices) => this.trainingDataUpdate({labelIndex: labelIndex, selectedIndices: selectedIndices})}
        />
      );
    }

    return <Markdown>{this.state.helpMarkdown}</Markdown>;
  }

  createRunSelectionArea() {
    if (this.state.knnType) {
      return (
        <RunSelections 
          trainingDataLength={this.state.knnType === 'data' && this.state.trainingData.length}
          test={(k, percent) => this.prepData(data => Classifier.test(data, k, percent, this.setProgress, this.setResults))}
          predict={(k, values) => this.prepData(data => Classifier.run(data, k, values, this.setProgress, this.setResults))}
        />
      );
    } else {
      return (<div />);
    }
  }

  createProgressCircle() {
    if (this.state.progressLabel) {
      return <ProgressCircle value={this.state.progressValue} label={this.state.progressLabel}/>
    } else {
      return (<div />);
    }
  }

  createResultTable() {
    if (this.state.knnType) {
      return (
        <ResultTable content={this.state.results} />
      );
    } else {
      return (<div />);
    }
  }

  render() {
    return (
      <div className="App">
        <Header 
          setTrainingData={this.setTrainingData}
          helpMarkdown={this.state.helpMarkdown}
        />

        {this.createDataSelectionArea()}
        {this.createRunSelectionArea()}
        {this.createProgressCircle()}
        {this.createResultTable()}

        <ErrorMessage 
          message={this.state.errorMessage}
          isVisible={this.state.displayError}
          close={() => this.setState({displayError: false})}
        />
      </div>
    );
  }
}

export default App;
