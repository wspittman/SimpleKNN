import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  padding: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    maxWidth: 800,
  },
}));

/**
 * A message area interpreted from markdown
 */
export default function Markdown(props) {
  const classes = useStyles();

  const headerVariant = level => {
    switch (level) {
      case 1: return 'h5';
      case 2: return 'h6';
      default: return 'subtitle1';
    }
  };

  const renderers = {
    heading: props => <Typography className={classes.padding} variant={headerVariant(props.level)}>{props.children}</Typography>,
    link: Link,
    listItem: props => <li><Typography component="span">{props.children}</Typography></li>,
    paragraph: props => <Typography className={classes.padding}>{props.children}</Typography>,
  };

  return <ReactMarkdown className={classes.padding} escapeHtml={false} renderers={renderers} {...props} />;
}