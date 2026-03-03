import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles, Group } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme, params: { position?: TextUiPosition }) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    padding: 24,
    pointerEvents: 'none',
    alignItems:
      params.position === 'top-center' ? 'flex-start' : params.position === 'bottom-center' ? 'flex-end' : 'center',
    justifyContent:
      params.position === 'right-center' ? 'flex-end' : params.position === 'left-center' ? 'flex-start' : 'center',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderRadius: 4,
    padding: '12px 20px 12px 16px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
    color: '#fff3fc',
    fontFamily: "'Geist', 'Roboto Condensed', sans-serif",
    pointerEvents: 'auto',
    position: 'relative',
    overflow: 'visible !important',

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
  accent: {
    width: 4,
    height: 40,
    backgroundColor: '#ffa3e9',
    borderRadius: 4,
    marginRight: 16,
    flexShrink: 0,
    boxShadow: '0 0 8px rgba(255, 163, 233, 0.4)',
  },
  content: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.02em',
    color: '#fff3fc',
    '& p': { margin: 0 },
  },
}));

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);
  const { classes } = useStyles({ position: data.position });

  useNuiEvent<TextUiProps>('textUi', (data) => {
    if (!data.position) data.position = 'right-center';
    setData(data);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
          <Box style={data.style} className={classes.container}>
            <Box className={classes.accent} />

            <Group spacing={12}>
              {data.icon && (
                <LibIcon
                  icon={data.icon}
                  fixedWidth
                  size="lg"
                  animation={data.iconAnimation}
                  style={{
                    color: data.iconColor,
                    alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                  }}
                />
              )}

              <Box className={classes.content}>
                <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                  {data.text}
                </ReactMarkdown>
              </Box>
            </Group>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default TextUI;
