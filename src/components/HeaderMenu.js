import React from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { readString as parseCSV } from 'react-papaparse';

const useStyles = makeStyles((theme) => ({
  input: {
    display: 'none',
  },
}));

/**
 * The menu attached to the header, contains file upload/download options
 * 
 * Props:
 * setTrainingData: (data) => Handle the uploaded training data
 * setModel: (model) => Handle the uploaded KNN model
 * saveModel: () => Download the currently trained KNN model
 * 
 * @param {*} props React props
 */
export default function HeaderMenu(props) {
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const uploadCSVRef = React.useRef(null);
  const uploadModelRef = React.useRef(null);
  const classes = useStyles();

  const menuClick = (event) => setMenuAnchor(event.currentTarget);
  const menuClose = () => setMenuAnchor(null);

  const upload = (ref, onLoad) => {
    if (ref.current.files) {
      const reader = new FileReader();
      reader.onload = (e) => onLoad(e.target.result);
      reader.readAsText(ref.current.files[0]);
    }
  }

  const onCSVUpload = () => upload(uploadCSVRef, text => props.setTrainingData(parseCSV(text).data));
  const onModelUpload = () => upload(uploadModelRef, text => {
    let parsed = null;
    try { parsed = JSON.parse(text) }
    catch (e) {}
    props.setModel(parsed);
  });

  const onExport = () => {
    props.saveModel();
    menuClose();
  }

  return (
    <div>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={menuClick}>
          <MenuIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={menuAnchor}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={menuClose}
      >
        <input
          accept=".csv"
          className={classes.input}
          id="upload-csv-button"
          type="file"
          onChange={onCSVUpload}
          ref={uploadCSVRef}
        />

        <label htmlFor="upload-csv-button">
          <MenuItem onClick={menuClose}>Upload CSV (Training Data)</MenuItem>
        </label>

        <input
          accept=".json"
          className={classes.input}
          id="import-model-button"
          type="file"
          onChange={onModelUpload}
          ref={uploadModelRef}
        />

        {/*<label htmlFor="import-model-button">
          <MenuItem onClick={menuClose}>Import KNN Model</MenuItem>
        </label>

        <MenuItem onClick={onExport}>Export KNN Model</MenuItem>*/}
      </Menu>
    </div>
  );
}
