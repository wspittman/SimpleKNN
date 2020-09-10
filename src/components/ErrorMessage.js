import React from 'react';
import { IconButton, Snackbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

/**
 * An error message
 * 
 * Props:
 * message: The text of the message
 * isVisible: True to show the message, hidden otherwise
 * close: () => Hide the message
 * 
 * @param {*} props React props
 */
export default function ErrorMessage(props) {
  return (
    <Snackbar
      open={props.isVisible}
      autoHideDuration={6000}
      onClose={props.close}
      message={props.message}
      action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={props.close}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  );
}
