let knn = window.ml5.KNNClassifier();
let isTrained = false;


//first column in each row is label, all others are active training data
const train = (data) => {
  for (let row of data) {
    if (row[0] != null) {
      knn.addExample(row.slice(1), row[0]);
    }
  }
}

export function test(data, k, percent, cb) {
  // Shuffle
  for (let i = data.length - 1; i >= 0; i--) {
    let r = Math.floor(Math.random() * (i + 1));
    let temp = data[i];
    data[i] = data[r];
    data[r] = temp;
  }

  let trainingLength = Math.floor(data.length * (percent / 100));
  train(data.slice(0, trainingLength));
  console.log("trained");

  for (let row of data.slice(trainingLength)) {
    knn.classify(row.slice(1), k)
       .then(result => {
          console.log(`Predicted ${result.label}, actually ${row[0]}`);

       });
  }
}

export function classify(data, k, values, cb) {
  if (!isTrained) {
    train(data);
    console.log("trained");
  }
  
  knn.classify(values, k)
     .then(result => {
        let rows = Object.keys(result.confidencesByLabel)
                         .map(key => [key, result.confidencesByLabel[key]])
                         .filter(x => x[1] > 0)
                         .sort((a, b) => b[1] - a[1]);


        cb({
          columns: ['Prediction', 'Confidence'],
          rows: rows,
        });
      });
}

export function clear() {
  knn.clearAllLabels();
  isTrained = false;
}

export function save() {
  knn.save();
}

export function load(jsonModel) {
  knn.load(jsonModel);
}
