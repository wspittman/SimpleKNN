import React from 'react';
import { Menu, Button, ButtonGroup, MenuItem, MenuList } from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

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

  const menuClick = (event) => setMenuAnchor(event.currentTarget);
  const menuClose = () => setMenuAnchor(null);

  const update = (index) => {
    setSelectedIndex(index);
    props.onSelectionChange(props.options[index]);
    menuClose();
  }

  return (
    <span>
      <ButtonGroup variant="outlined" color="primary">
        <Button onClick={() => props.onClick(props.options[selectedIndex])} size="large">
          {props.options[selectedIndex]}
        </Button>
        <Button onClick={menuClick} size="small">
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      
      <Menu anchorEl={menuAnchor} keepMounted open={Boolean(menuAnchor)} onClose={menuClose}>
          <MenuList id="split-button-menu">
            {props.options.map((option, index) => (
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
