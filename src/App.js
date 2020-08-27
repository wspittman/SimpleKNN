import React from 'react';
import Header from './components/Header';
import DataSelections from './components/DataSelections';

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

  render() {
    return (
      <div className="App">
        <Header 
          knn={this.state.knn}
          setData={(data) => {console.log(data); this.setState({data: data})}}
        />

        <DataSelections 
          columns={this.state.data[0]}
          example={this.state.data[1]}
          labelIndex={this.state.labelIndex}
          selectedIndices={this.state.selectedIndices}
          setLabelIndex={(index) => {this.setState({labelIndex: index})}}
          setSelectedIndices={(indices) => {this.setState({selectedIndices: indices})}}
        />
        
      </div>
    );
  }
}

export default App;
