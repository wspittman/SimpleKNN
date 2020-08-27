import React from 'react';
import Header from './components/Header';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      knn: window.ml5.KNNClassifier()
    };
  }

  render() {
    return (
      <div className="App">
        <Header 
          knn={this.state.knn}
        />
        
      </div>
    );
  }
}

export default App;
