import React from 'react';
import Header from './components/Header';
import DataSelections from './components/DataSelections';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      knn: window.ml5.KNNClassifier(),
      data: [],
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
          onChange={() => {}}
        />
        
      </div>
    );
  }
}

export default App;
