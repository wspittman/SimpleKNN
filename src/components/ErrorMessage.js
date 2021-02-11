import { IconButton, Snackbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';

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
  let { isVisible, close, message } = props;

  return (
    <Snackbar
      open={isVisible}
      autoHideDuration={6000}
      onClose={close}
      message={message}
      action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={close}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  );
}
