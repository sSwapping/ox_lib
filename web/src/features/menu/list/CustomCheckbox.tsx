import { Checkbox, createStyles } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    '&:checked': {
      backgroundColor: '#ffa3e9',
      borderColor: '#ffa3e9',
    },
  },
  inner: {
    '> svg > path': {
      fill: theme.colors.dark[9],
    },
  },
}));

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
  const { classes } = useStyles();
  return (
    <Checkbox
      checked={checked}
      readOnly
      size="md"
      classNames={{ root: classes.root, input: classes.input, inner: classes.inner }}
    />
  );
};

export default CustomCheckbox;
