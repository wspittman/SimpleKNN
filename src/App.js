import React from 'react';
import Header from './components/Header';
import DataSelections from './components/DataSelections';
import RunSelections from './components/RunSelections';
import ResultTable from './components/ResultTable';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      knn: window.ml5.KNNClassifier(),
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

  //first column in each row is label, all others are active training data
  train(data) {
    for (let row of data) {
      if (row[0] != null) {
        this.state.knn.addExample(row.slice(1), row[0]);
      }
    }
  }

  test(k, percent) {
    let data = this.prepData();

    // Shuffle
    for (let i = data.length - 1; i >= 0; i--) {
      let r = Math.floor(Math.random() * (i + 1));
      let temp = data[i];
      data[i] = data[r];
      data[r] = temp;
    }

    let trainingLength = Math.floor(data.length * (percent / 100));
    this.train(data.slice(0, trainingLength));
    console.log("trained");

    for (let row of data.slice(trainingLength)) {
      this.state.knn.classify(row.slice(1), k)
                    .then(result => {
                      console.log(`Predicted ${result.label}, actually ${row[0]}`);
                    });
    }
  }

  classify(k, values) {
    let data = this.prepData();

    this.train(data);
    console.log("trained");

    this.state.knn.classify(values, k)
                  .then(result => {
                      let rows = Object.keys(result.confidencesByLabel).map(key => [key, result.confidencesByLabel[key]]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]);

                      this.setState({
                        resultColumns: ['Prediction', 'Confidence'],
                        resultRows: rows,
                      })
                    });
  }

  render() {
    return (
      <div className="App">
        <Header 
          knn={this.state.knn}
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
          test={(k, percent) => this.test(k, percent)}
          classify={(k, values) => this.classify(k, values)}
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
