let knn = window.ml5.KNNClassifier();
let isTrained = false;

let predictCallCount = 0;
let results = [];

// Clear the result objects
const clearResults = (expectedCount) => {
  predictCallCount = expectedCount;
  results = [];
};

// Perform an in-place shuffling of the data
const shuffle = (data) => {
  for (let i = data.length - 1; i >= 0; i--) {
    let r = Math.floor(Math.random() * (i + 1));
    let temp = data[i];
    data[i] = data[r];
    data[r] = temp;
  }
};

// Train the KNN with this data, format [[label, val1, val2, ...], ...]
const train = (data) => {
  for (let row of data) {
    let label = row[0];

    if (label != null) {
      knn.addExample(row.slice(1), label);
    }
  }

  console.log("KNN Trained");
};

/**
 * Make a prediction
 * @param {Number} k The K for K-Nearest-Neighbors
 * @param {Number[]} values The values to predict on
 * @param {String} expected The expected result if testing, or null otherwise
 * @param {Function} done Callback with (), called only by one predict function when all are complete
 */
const predict = (k, values, expected, done) => {
  knn.classify(values, k)
     .then(result => {
       results.push({
         label: result.label,
         confidences: result.confidencesByLabel,
         expected: expected
        });

       if (results.length === predictCallCount) {
         done();
       }
     });
};

const createTestSummary = (done) => {
  let summary = {};
  let correctCount = 0;

  for (let result of results) {
    console.log(`Predicted ${result.label}, actually ${result.expected}`);

    let { label, confidences, expected } = result;

    if (label === expected) correctCount++;

    summary[expected] = summary[expected] || {};
    summary[expected][label] = summary[expected][label] || { count: 0, confidenceSum: 0 };

    summary[expected][label].count++;
    summary[expected][label].confidenceSum += confidences[label];
  }

  let correctRows = [];
  let incorrectRows = [];
  
  for (let expected of Object.keys(summary)) {
    for (let label of Object.keys(summary[expected])) {
      let row = [
        summary[expected][label].count,
        expected,
        label,
        (summary[expected][label].confidenceSum / summary[expected][label].count).toFixed(2),
      ];

      if (expected === label) {
        correctRows.push(row.slice(0, 2).concat(row.slice(3)));
      } else {
        incorrectRows.push(row);
      }
    }
  }

  done([
    { 
      title: `${(correctCount / results.length * 100).toFixed(2)}% Predicted Correctly`,
      columns: ['Count', 'Predicted', 'Average Confidence'],
      rows: correctRows,
    },
    { 
      title: `${((results.length - correctCount) / results.length * 100).toFixed(2)}% Predicted Incorrectly`,
      columns: ['Count', 'Actual', 'Predicted', 'Average Confidence'],
      rows: incorrectRows,
    }
  ]);
};

function test(data, k, percent, done) {
  shuffle(data);

  let trainingLength = Math.floor(data.length * (percent / 100));
  let trainingData = data.slice(0, trainingLength);
  let testingData = data.slice(trainingLength);

  // Always retrain in test mode
  train(trainingData);
  isTrained = false;

  clearResults(testingData.length);

  for (let row of testingData) {
    predict(k, row.slice(1), row[0], () => createTestSummary(done));
  }
}

function run(data, k, values, done) {
  if (!isTrained) {
    train(data);
    isTrained = true;
  }
  
  clearResults(1);

  predict(k, values, null, () => {
    let confidences = results[0].confidences;
    let rows = Object.keys(confidences)
                     .map(key => [key, confidences[key].toFixed(2)])
                     .filter(x => x[1] > 0)
                     .sort((a, b) => b[1] - a[1]);

    done([{
      title: `Classify values [${values}] with K=${k}`,
      columns: ['Predicted', 'Confidence'],
      rows: rows,
    }]);
  });
}

function clear() {
  knn = window.ml5.KNNClassifier();
  isTrained = false;
}

function save() {
  knn.save();
}

function load(jsonModel) {
  knn.load(jsonModel);
}

export default {
  test: test,
  run: run,
  clear: clear,
  save: save,
  load: load,
};
