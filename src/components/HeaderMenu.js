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
 * setData: (data) => Do what you need to with a new data set
 * knn: The ML5 KNN object
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

  const onCSVUpload = () => {
    const reader = new FileReader();
    reader.onload = (e) => props.setData(parseCSV(e.target.result).data);
    reader.readAsText(uploadCSVRef.current.files[0]);
  };

  const onModelUpload = () => {
    const reader = new FileReader();
    reader.onload = (e) => props.knn.load(JSON.parse(e.target.result));
    reader.readAsText(uploadModelRef.current.files[0]);
  }

  const onExport = () => {
    props.knn.save();
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
          <MenuItem onClick={menuClose}>Upload CSV</MenuItem>
        </label>

        <input
          accept=".json"
          className={classes.input}
          id="import-model-button"
          type="file"
          onChange={onModelUpload}
          ref={uploadModelRef}
        />

        <label htmlFor="import-model-button">
          <MenuItem onClick={menuClose}>Import KNN Model</MenuItem>
        </label>

        <MenuItem onClick={onExport}>Export KNN Model</MenuItem>
      </Menu>
    </div>
  );
}
