let knn = window.ml5.KNNClassifier();
let isTrained = false;
let predictions = [];

// Perform an in-place shuffling of the data
const shuffle = (data) => {
  for (let i = data.length - 1; i >= 0; i--) {
    let r = Math.floor(Math.random() * (i + 1));
    let temp = data[i];
    data[i] = data[r];
    data[r] = temp;
  }
};

const runBatch = (length, func, updateProgress, done) => {
  const batchSize = Math.max(20, Math.floor(length / 100));
  let start = 0;

  const next = () => {
    updateProgress(start / length);
    setTimeout(start < length ? batch : done);
  };    

  const batch = () => {
    let end = Math.min(start + batchSize, length);
    func(start, end, next);
    start = end;
  };

  next();
};

// Train the KNN with this data, format [[label, val1, val2, ...], ...]
const train = (data, updateProgress, done)  => {
  const trainer = (start, end, next) => {
    for (let i = start; i < end; i++) {
      let label = data[i][0];

      if (label != null) {
        knn.addExample(data[i].slice(1), label);
      }
    }

    next();
  };

  runBatch(data.length, trainer, (val) => updateProgress('Training', val), done);
};

/**
 * Make a prediction
 * @param {Number} k The K for K-Nearest-Neighbors
 * @param {Number[][]} rows The list of value rows to predict on
 * @param {String[]} expectedResults The expected results if testing, or null otherwise
 * @param {Function} updateProgress Updater with (name, (0..1)), informs callers about partial progress
 * @param {Function} done Callback with (), called only by one predict function when all are complete
 */
const predict = (k, rows, expectedResults, updateProgress, done) => {
  const formatResult = (result, i) => {
    return {
      label: result.value.label,
      confidences: result.value.confidencesByLabel,
      expected: expectedResults ? expectedResults[i] : null
    };
  }

  const predictor = (start, end, next) => {
    let promises = rows.slice(start, end)
                       .map(row => knn.classify(row, k));

    Promise.allSettled(promises)
           .then(results => {
             predictions = predictions.concat(results.map(formatResult));
             next();
           });
  };

  runBatch(rows.length, predictor, (val) => updateProgress('Predicting', val), done);
};

const createTestSummary = (done) => {
  let summary = {};
  let correctCount = 0;

  for (let result of predictions) {
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
      title: `${(correctCount / predictions.length * 100).toFixed(2)}% Predicted Correctly`,
      columns: ['Count', 'Predicted', 'Average Confidence'],
      rows: correctRows,
    },
    { 
      title: `${((predictions.length - correctCount) / predictions.length * 100).toFixed(2)}% Predicted Incorrectly`,
      columns: ['Count', 'Actual', 'Predicted', 'Average Confidence'],
      rows: incorrectRows,
    }
  ]);
};

const createRunSummary = (k, values, done) => {
  let confidences = predictions[0].confidences;
  let rows = Object.keys(confidences)
                    .map(key => [confidences[key].toFixed(2), key])
                    .filter(x => x[0] > 0);

  done([{
    title: `Predict for values [${values}] with K=${k}`,
    columns: ['Confidence', 'Prediction'],
    rows: rows,
  }]);
};

function test(data, k, percent, updateProgress, done) {
  shuffle(data);

  let trainingLength = Math.floor(data.length * (percent / 100));
  let trainingData = data.slice(0, trainingLength);
  let otherData = data.slice(trainingLength);
  let testingData = otherData.map(row => row.slice(1));
  let expectedResults = otherData.map(row => row[0]);

  isTrained = false;
  predictions = [];

  // Always retrain in test mode
  train(trainingData, updateProgress, () => {
    predict(k, testingData, expectedResults, updateProgress, () => createTestSummary(done));
  });
}

function run(data, k, values, updateProgress, done) {
  predictions = [];

  const maybeTrain = (done) => {
    if (isTrained) return done();

    isTrained = true;
    train(data, updateProgress, done);
  };

  maybeTrain(() => { predict(k, [values], null, updateProgress, () => createRunSummary(k, values, done)) });
}

function clear() {
  knn = window.ml5.KNNClassifier();
  isTrained = false;
}

function save() {
  knn.save();
}

function load(jsonModel, done) {
  knn.load(jsonModel)
     .then(done)
     .catch(done);
}

export default {
  test: test,
  run: run,
  clear: clear,
  save: save,
  load: load,
};
