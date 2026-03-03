import React, { useEffect } from 'react';
import { Box, createStyles, RingProgress, Stack, Text, useMantineTheme } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { CircleProgressbarProps } from '../../typings';

const useStyles = createStyles((theme, params: { position: 'middle' | 'bottom' }) => ({
  container: {
    width: '100%',
    height: params.position === 'middle' ? '100%' : '20%',
    bottom: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  wrapper: {
    marginTop: params.position === 'middle' ? 25 : undefined,
    position: 'relative',
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff3fc',
    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    marginTop: 8,
    textAlign: 'center',
  },
  value: {
    fontSize: 14,
    fontWeight: 700,
    color: '#ffa3e9',
    fontVariantNumeric: 'tabular-nums',
  },
  ring: {
    filter: 'drop-shadow(0 0 4px rgba(255, 163, 233, 0.2))',
    '& circle:first-of-type': {
      stroke: 'rgba(20, 20, 20, 0.8)',
      strokeWidth: 8,
    },
    '& circle:last-of-type': {
      stroke: '#ffa3e9',
      strokeLinecap: 'round',
      filter: 'drop-shadow(0 0 6px rgba(255, 163, 233, 0.4))',
      transition: 'stroke-dashoffset 100ms linear',
    },
  },
}));

const CircleProgressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [progressDuration, setProgressDuration] = React.useState(0);
  const [position, setPosition] = React.useState<'middle' | 'bottom'>('middle');
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState('');
  const theme = useMantineTheme();
  const { classes } = useStyles({ position });

  useNuiEvent('progressCancel', () => {
    setVisible(false);
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    if (visible) return;
    setVisible(true);
    setValue(0);
    setLabel(data.label || '');
    setProgressDuration(data.duration);
    setPosition(data.position || 'middle');
  });

  useEffect(() => {
    if (!visible || progressDuration <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newValue = Math.min((elapsed / progressDuration) * 100, 100);

      setValue(newValue);

      if (newValue >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setVisible(false);
          fetchNui('progressComplete');
        }, 200);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [visible, progressDuration]);

  return (
    <Box className={classes.container}>
      <ScaleFade visible={visible}>
        <Stack spacing={0} align="center" className={classes.wrapper}>
          <RingProgress
            size={90}
            thickness={8}
            roundCaps
            sections={[{ value: value, color: '#ffa3e9' }]}
            className={classes.ring}
            label={
              <Text align="center" className={classes.value}>
                {Math.round(value)}%
              </Text>
            }
          />
          {label && <Text className={classes.label}>{label}</Text>}
        </Stack>
      </ScaleFade>
    </Box>
  );
};

export default CircleProgressbar;
