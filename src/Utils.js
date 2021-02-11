import { readString as parseCSV } from 'react-papaparse';

/**
 * Upload a file from an input element
 * 
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

/**
 * Parse an input file as a CSV
 * 
 * @param {Ref} ref The input element reference
 * @param {Function} done Callback with (text)
 */
function uploadCSV(ref, done) {
  upload(ref, text => done(parseCSV(text).data));
}

/**
 * Parse an input file as JSON
 * 
 * @param {Ref} ref The input element reference
 * @param {Function} done Callback with (object)
 */
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