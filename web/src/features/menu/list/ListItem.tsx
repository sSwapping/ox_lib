import { Box, createStyles, Group, Progress, Stack, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
  active: boolean;
}

const useStyles = createStyles((theme, params: { active: boolean; iconColor?: string }) => ({
  buttonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 6,
    padding: '10px 14px',
    height: 52,
    scrollMargin: 8,
    position: 'relative',
    border: '1px solid transparent',
    transition: 'all 0.2s ease',
    cursor: 'pointer',

    '&:focus': {
      outline: 'none',
    },

    ...(params.active && {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 163, 233, 0.1)',
    }),
  },
  activeAccent: {
    position: 'absolute',
    left: 8,
    top: '50%',
    transform: 'translateY(-50%)',
    height: 36,
    width: 3,
    borderRadius: 4,
    backgroundColor: '#ffa3e9',
    boxShadow: '0 0 10px rgba(255, 163, 233, 0.5)',
    display: params.active ? 'block' : 'none',
  },
  buttonWrapper: {
    height: '100%',
    marginLeft: params.active ? 16 : 0,
    transition: 'margin-left 0.2s ease',
  },
  iconImage: {
    maxWidth: 24,
    maxHeight: 24,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
    color: params.active ? '#ffa3e9' : params.iconColor || theme.colors.gray[5],
  },
  label: {
    color: params.active ? '#ffa3e9' : theme.colors.gray[4],
    fontWeight: params.active ? 600 : 500,
    fontSize: 15,
    lineHeight: 1,
    fontFamily: 'Roboto, sans-serif',
  },
  subLabel: {
    color: params.active ? 'rgba(255, 163, 233, 0.7)' : theme.colors.gray[6],
    fontSize: 13,
  },
  chevronIcon: {
    fontSize: 12,
    color: params.active ? '#ffa3e9' : theme.colors.gray[6],
  },
  scrollIndexValue: {
    color: params.active ? '#ffa3e9' : theme.colors.gray[4],
    fontSize: 13,
    fontWeight: 500,
  },
  progressStack: {
    width: '100%',
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: theme.colors.gray[3],
  },
}));

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(
  ({ item, index, scrollIndex, checked, active }, ref) => {
    const { classes } = useStyles({ active, iconColor: item.iconColor });

    return (
      <Box
        tabIndex={index}
        className={classes.buttonContainer}
        key={`item-${index}`}
        ref={(element: HTMLDivElement) => {
          if (ref)
            // @ts-ignore
            return (ref.current = [...ref.current, element]);
        }}
      >
        <Box className={classes.activeAccent} />
        <Group spacing={0} noWrap className={classes.buttonWrapper}>
          {item.icon && (
            <Box className={classes.iconContainer}>
              {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                <img src={item.icon} alt="icon" className={classes.iconImage} />
              ) : (
                <LibIcon
                  icon={item.icon as IconProp}
                  className={classes.icon}
                  fixedWidth
                  animation={item.iconAnimation}
                />
              )}
            </Box>
          )}

          {Array.isArray(item.values) ? (
            <Group position="apart" w="100%">
              <Stack spacing={2} justify="center">
                <Text className={classes.label}>{item.label}</Text>
                <Text className={classes.subLabel}>
                  {typeof item.values[scrollIndex] === 'object'
                    ? // @ts-ignore
                      item.values[scrollIndex].label
                    : item.values[scrollIndex]}
                </Text>
              </Stack>
              <Group spacing={6} position="center">
                <LibIcon icon="chevron-left" className={classes.chevronIcon} />
                <Text className={classes.scrollIndexValue}>
                  {scrollIndex + 1}/{item.values.length}
                </Text>
                <LibIcon icon="chevron-right" className={classes.chevronIcon} />
              </Group>
            </Group>
          ) : item.checked !== undefined ? (
            <Group position="apart" w="100%">
              <Text className={classes.label}>{item.label}</Text>
              <CustomCheckbox checked={checked} />
            </Group>
          ) : item.progress !== undefined ? (
            <Stack className={classes.progressStack} spacing={0}>
              <Text className={classes.progressLabel}>{item.label}</Text>
              <Progress
                value={item.progress}
                size="sm"
                color={item.colorScheme || 'teal'}
                styles={(theme) => ({
                  root: { backgroundColor: 'rgba(0,0,0,0.3)' },
                  bar: { backgroundColor: '#ffa3e9' },
                })}
              />
            </Stack>
          ) : (
            <Text className={classes.label}>{item.label}</Text>
          )}
        </Group>
      </Box>
    );
  }
);

export default React.memo(ListItem);
