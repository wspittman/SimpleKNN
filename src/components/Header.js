import React from 'react';
import { AppBar, Dialog, IconButton, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PostAddOutlinedIcon from '@material-ui/icons/PostAddOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import GitHubIcon from '@material-ui/icons/GitHub';
import Markdown from './Markdown';
import Utils from '../Utils';

const useStyles = makeStyles((theme) => ({
  header: {
    zIndex: theme.zIndex.drawer + 1,
  },
  input: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
}));

/**
 * The header bar
 * 
 * Props:
 * setTrainingData: (data) => Handle the uploaded training data
 * helpMarkdown: ...
 * 
 * @param {*} props React props
 */
export default function Header(props) {
  const [open, setOpen] = React.useState(false);
  const uploadCSVRef = React.useRef(null);
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.header}>
      <Toolbar>
        <Typography variant="h6" noWrap className={classes.title}>
          SimpleKNN
        </Typography>

        <input
          accept=".csv"
          className={classes.input}
          id="upload-csv-button"
          type="file"
          onChange={() => Utils.uploadCSV(uploadCSVRef, text => props.setTrainingData(text))}
          ref={uploadCSVRef}
        />

        <label htmlFor="upload-csv-button">
          <Tooltip title="Upload CSV data set">
            <IconButton color="inherit" aria-label="add" component="span">
              <PostAddOutlinedIcon />
            </IconButton>
          </Tooltip>
        </label>

        <Tooltip title="Help Dialog">
          <IconButton color="inherit" aria-label="help" onClick={() => setOpen(true)}>
            <HelpOutlineOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <Markdown>
            {props.helpMarkdown}
          </Markdown>
        </Dialog>

        <Tooltip title="GitHub Repository">
          <IconButton color="inherit" aria-label="github" href="https://github.com/wspittman/SimpleKNN.git" target="_blank" rel="noopener noreferrer"> 
            <GitHubIcon />
          </IconButton>
        </Tooltip>

      </Toolbar>
    </AppBar>
  );
}
