import { readString as parseCSV } from 'react-papaparse';

/**
 * @param {Ref} ref The input element reference
 * @param {Function} done Callback with (text)
 */
function upload(ref, done) {
  if (ref.current.files) {
    const reader = new FileReader();
    reader.onload = (e) => done(e.target.result);
    reader.readAsText(ref.current.files[0]);
  }
}

function uploadCSV(ref, done) {
  upload(ref, text => done(parseCSV(text).data));
}

function uploadJSON(ref, done) {
  upload(ref, text => {
    let parsed = null;
    try { parsed = JSON.parse(text) }
    catch (e) {}
    done(parsed);
  });
}

export default {
  uploadCSV: uploadCSV,
  uploadJSON: uploadJSON,
};