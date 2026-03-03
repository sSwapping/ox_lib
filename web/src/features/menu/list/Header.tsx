import { ActionIcon, Box, createStyles, Text } from '@mantine/core';
import React from 'react';
import LibIcon from '../../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px 20px 8px 20px',
    width: '100%',
  },
  heading: {
    fontSize: 22,
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 800,
    color: theme.white,
    letterSpacing: '-0.02em',
    textTransform: 'uppercase',
  },
}));

interface HeaderProps {
  title: string;
  onClose?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{title}</Text>
    </Box>
  );
};

export default React.memo(Header);
