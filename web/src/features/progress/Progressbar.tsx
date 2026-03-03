import React, { useEffect } from 'react';
import { Box, createStyles, Group, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: '5%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 320,
    fontFamily: 'Roboto, sans-serif',
    pointerEvents: 'none',
  },
  header: {
    marginBottom: 6,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff3fc',
    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  percentage: {
    fontSize: 14,
    fontWeight: 700,
    color: '#ffa3e9',
    fontVariantNumeric: 'tabular-nums',
  },
  track: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: `repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 4px,
      rgba(255, 255, 255, 0.4) 4px,
      rgba(255, 255, 255, 0.3) 5px
    )`,
  },
  bar: {
    height: '100%',
    backgroundColor: '#ffa3e9',
    borderRadius: 4,
    boxShadow: '0 0 10px rgba(255, 163, 233, 0.4)',
    transition: 'width 100ms linear',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 100%)',
      borderRadius: 4,
    },
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setProgress(0);
  });

  useEffect(() => {
    if (!visible || duration <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        // Small delay before hiding to show 100%
        setTimeout(() => {
          setVisible(false);
          fetchNui('progressComplete');
        }, 200);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [visible, duration]);

  return (
    <Box className={classes.root}>
      <ScaleFade visible={visible}>
        <Group position="apart" className={classes.header}>
          <Text className={classes.label}>{label}</Text>
          <Text className={classes.percentage}>{Math.round(progress)}%</Text>
        </Group>

        <Box
          className={classes.track}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          <Box className={classes.bar} sx={{ width: `${progress}%` }} />
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default Progressbar;
