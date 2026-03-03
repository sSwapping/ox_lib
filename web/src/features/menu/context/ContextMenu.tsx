import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { Box, createStyles, Flex, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ContextMenuProps } from '../../../typings';
import ContextButton from './components/ContextButton';
import { fetchNui } from '../../../utils/fetchNui';
import ReactMarkdown from 'react-markdown';
import HeaderButton from './components/HeaderButton';
import MarkdownComponents from '../../../config/MarkdownComponents';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: true });
};

const useStyles = createStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '15%',
    right: '15%',
    width: 340,
    maxHeight: 580,
    backgroundColor: '#141414',
    borderRadius: 8,
    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible !important',
    fontFamily: 'Roboto, sans-serif',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transform: 'translate3d(0, 0, 0)',

    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      borderRadius: theme.radius.sm,
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      zIndex: 100,
      pointerEvents: 'none',
      backgroundImage: `
        linear-gradient(to right, #ffa3e9 2px, transparent 2px),
        linear-gradient(to bottom, #ffa3e9 2px, transparent 2px),
        linear-gradient(to left, #ffa3e9 2px, transparent 2px),
        linear-gradient(to bottom, #ffa3e9 2px, transparent 2px),
        linear-gradient(to left, #ffa3e9 2px, transparent 2px),
        linear-gradient(to top, #ffa3e9 2px, transparent 2px),
        linear-gradient(to right, #ffa3e9 2px, transparent 2px),
        linear-gradient(to top, #ffa3e9 2px, transparent 2px)
      `,
      backgroundPosition: `
        0 0, 0 0,
        100% 0, 100% 0,
        100% 100%, 100% 100%,
        0 100%, 0 100%
      `,
      backgroundSize: '12px 12px',
      backgroundRepeat: 'no-repeat',
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px 8px 20px',
    gap: 12,
    flexShrink: 0,
  },
  titleContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: '#fff3fc',
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.2,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Roboto, sans-serif',
    letterSpacing: '-0.02em',
  },
  buttonsContainer: {
    flex: 1,
    overflowY: 'auto',
    minHeight: 0,
    padding: '12px 12px 12px 12px',
    '&::-webkit-scrollbar': {
      width: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 4,
    },
  },
  buttonsFlexWrapper: {
    gap: 8,
  },
}));

const ContextMenu: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps>({
    title: '',
    options: { '': { description: '', metadata: [] } },
  });

  const closeContext = () => {
    if (contextMenu.canClose === false) return;
    setVisible(false);
    fetchNui('closeContext');
  };

  // Hides the context menu on ESC
  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) closeContext();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  useNuiEvent('hideContext', () => setVisible(false));

  useNuiEvent<ContextMenuProps>('showContext', async (data) => {
    if (visible) {
      setVisible(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setContextMenu(data);
    setVisible(true);
  });

  return (
    <>
      {visible && (
        <Box className={classes.container}>
          <Flex className={classes.header}>
            {contextMenu.menu && (
              <HeaderButton icon="chevron-left" iconSize={16} handleClick={() => openMenu(contextMenu.menu)} />
            )}
            <Box className={classes.titleContainer}>
              <Text className={classes.titleText}>
                <ReactMarkdown components={MarkdownComponents}>{contextMenu.title}</ReactMarkdown>
              </Text>
            </Box>
            <HeaderButton icon="xmark" canClose={contextMenu.canClose} iconSize={18} handleClick={closeContext} />
          </Flex>
          <Box className={classes.buttonsContainer}>
            <Stack className={classes.buttonsFlexWrapper}>
              {Object.entries(contextMenu.options).map((option, index) => (
                <ContextButton option={option} key={`context-item-${index}`} />
              ))}
            </Stack>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ContextMenu;
