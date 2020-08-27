import React from 'react';
import Header from './components/Header';
import DataSelections from './components/DataSelections';
import { Button } from '@material-ui/core';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      knn: window.ml5.KNNClassifier(),
      data: [],
      labelIndex: 0,
      selectedIndices: [],
    };
  }

  trainClassifier() {
    this.state.knn.clearAllLabels();

    let dataIndices = [];
    this.state.selectedIndices.forEach((val, i) => { if (val) { dataIndices.push(i); } });

    const trimData = this.state.data.slice(1).map(row => [row[this.state.labelIndex]].concat(dataIndices.map(i => +row[i])));

    //temp slice
    for (let row of trimData.slice(1)) {
      if (row[0] != null) {
        this.state.knn.addExample(row.slice(1), row[0]);
      }
    }
    
    //temp
    this.state.knn.classify(trimData[0].slice(1), 3, (error, result) => {
      if (error) return console.error(error);
      console.log(result);
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

        <Button onClick={() => this.trainClassifier()}>Temp Test</Button>
        
      </div>
    );
  }
}

export default App;
