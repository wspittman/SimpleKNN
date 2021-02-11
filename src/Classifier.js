let knn = window.ml5.KNNClassifier();
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

/**
 * Run a function, presumably async, in batches.
 * 
 * @param {*} length The total length of the data
 * @param {Function} func A function with (start, end, next) to run in batches
 * @param {Function} updateProgress Updater with (0..1), informs callers about partial progress
 * @param {Function} done Callback with ()
 */
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

/**
 * Train the KNN Classifier
 * 
 * @param {Array} data The training data in the format [[label, data1, ...], ...]
 * @param {Function} updateProgress Updater with (name, (0..1)), informs callers about partial progress
 * @param {Function} done Callback with ()
 */
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
 * Make a prediction based on a previously trained classifier
 * 
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

/**
 * Create a test summary from the completed predictions.
 * 
 * @param {Function} done Callback with (Object), with the test results
 */
const createTestSummary = (done) => {
  let summary = {};

  for (let result of predictions) {
    let { label, confidences, expected } = result;

    summary[expected] = summary[expected] || {};
    summary[expected][label] = summary[expected][label] || { count: 0, confidences: [] };

    summary[expected][label].count++;
    summary[expected][label].confidences.push(confidences[label]);
  }

  done(summary);
};

/**
 * Run a test by training on some portion of the data and validating on the remainder.
 * 
 * @param {Array} data The training data in the format [[label, data1, ...], ...]
 * @param {Number} k The K value for K-Nearest Neighbors
 * @param {Number} percent The percentage (int) of the data to use for training (vs. validation)
 * @param {Function} updateProgress Updater with (name, (0..1)), informs callers about partial progress
 * @param {Function} done Callback with (Object), with the test results
 */
function test(data, k, percent, updateProgress, done) {
  shuffle(data);

  let trainingLength = Math.floor(data.length * (percent / 100));
  let trainingData = data.slice(0, trainingLength);
  let otherData = data.slice(trainingLength);
  let testingData = otherData.map(row => row.slice(1));
  let expectedResults = otherData.map(row => row[0]);

  predictions = [];

  // Always retrain in test mode
  train(trainingData, updateProgress, () => {
    predict(k, testingData, expectedResults, updateProgress, () => createTestSummary(done));
  });
}

/**
 * Reset the state of the underlying KNN object
 */
function clear() {
  knn = window.ml5.KNNClassifier();
}

export default {
  test: test,
  clear: clear,
};
