import { Button, ButtonGroup, Menu, MenuItem, MenuList } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import React from 'react';

/**
 * A generic split button
 * 
 * Props:
 * options: An array of string options
 * onSelectionChange: (option) => Callback for whent the selection is changed
 * onClick: (option) => Callback for when the main button is clicked, with the selected option
 * 
 * @param {*} props React props
 */
export default function SplitButton(props) {
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  let { options, onSelectionChange, onClick } = props;

  // If only one option was provided, just send a regular button
  if (options.length === 1) {
    return (
      <Button variant="outlined" color="primary" onClick={() => onClick(options[selectedIndex])} size="large">
        {options[selectedIndex]}
      </Button>
    );
  }

  const menuClick = (event) => setMenuAnchor(event.currentTarget);
  const menuClose = () => setMenuAnchor(null);

  const update = (index) => {
    setSelectedIndex(index);
    onSelectionChange(options[index]);
    menuClose();
  };

  return (
    <span>
      <ButtonGroup variant="outlined" color="primary">
        <Button onClick={() => onClick(options[selectedIndex])} size="large">
          {options[selectedIndex]}
        </Button>
        <Button onClick={menuClick} size="small">
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      
      <Menu anchorEl={menuAnchor} keepMounted open={Boolean(menuAnchor)} onClose={menuClose}>
          <MenuList id="split-button-menu">
            {options.map((option, index) => (
              <MenuItem
                key={option}
                selected={index === selectedIndex}
                onClick={() => update(index)}
              >
                {option}
              </MenuItem>
            ))}
          </MenuList>
      </Menu>
    </span>
  );
}
