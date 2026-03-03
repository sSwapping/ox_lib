import { Button, createStyles, Group, Modal, Stack, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const useStyles = createStyles((theme, { iconColor }: { iconColor: string }) => ({
  modal: {
    backgroundColor: '#141414',
    borderRadius: 8,
    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
    fontFamily: 'Roboto, sans-serif',
    padding: '0 !important',
    overflow: 'visible !important',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    transform: 'translate3d(0, 0, 0)',
  },
  header: {
    padding: '16px 20px 8px 20px',
    margin: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  title: {
    color: '#fff3fc',
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.2,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Roboto, sans-serif',
    letterSpacing: '-0.02em',
    width: '100%',
  },
  body: {
    padding: '12px',
    '&::-webkit-scrollbar': {
      width: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 4,
    },

    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      borderRadius: 4,
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
  contentStack: {
    color: theme.colors.gray[4],
    fontFamily: 'Roboto, sans-serif',
    fontSize: 15,
    fontWeight: 500,
  },
  button: {
    height: 44,
    minWidth: 100,
    padding: '0 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
    color: '#fff3fc',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: 15,
    fontWeight: 500,
    fontFamily: 'Roboto, sans-serif',
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      borderColor: 'rgba(255, 163, 233, 0.3)',
      color: '#ffa3e9',
      transform: 'translateY(-1px)',
    },

    '&:active': {
      transform: 'translateY(1px)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      boxShadow: 'none',
    },

    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      transform: 'none',
      boxShadow: 'none',
      color: theme.colors.gray[6],
    },

    '&:focus-visible': {
      outline: '2px solid #ffa3e9',
      outlineOffset: 2,
    },
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    color: theme.colors.gray[4],
    borderColor: 'transparent',

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      color: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-1px)',
    },

    '&:active': {
      transform: 'translateY(1px)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },
}));

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const { classes, cx } = useStyles({ iconColor: '#ffa3e9' });
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setOpened(false);
  });

  return (
    <>
      <Modal
        opened={opened}
        centered={dialogData.centered}
        size={dialogData.size || 'md'}
        overflow={dialogData.overflow ? 'inside' : 'outside'}
        closeOnClickOutside={false}
        onClose={() => {
          setOpened(false);
          closeAlert('cancel');
        }}
        classNames={{
          modal: classes.modal,
          header: classes.header,
          title: classes.title,
          body: classes.body,
        }}
        withCloseButton={false}
        overlayOpacity={0.5}
        exitTransitionDuration={150}
        transition="fade"
        title={<ReactMarkdown components={MarkdownComponents}>{dialogData.header}</ReactMarkdown>}
      >
        <Stack className={classes.contentStack}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              ...MarkdownComponents,
              img: ({ ...props }) => <img style={{ maxWidth: '100%', maxHeight: '100%' }} {...props} />,
            }}
          >
            {dialogData.content}
          </ReactMarkdown>
          <Group position="right" spacing={10}>
            {dialogData.cancel && (
              <Button
                variant="default"
                onClick={() => closeAlert('cancel')}
                className={cx(classes.button, classes.cancelButton)}
              >
                {dialogData.labels?.cancel || locale.ui.cancel || 'Cancel'}
              </Button>
            )}
            <Button variant="default" onClick={() => closeAlert('confirm')} className={classes.button}>
              {dialogData.labels?.confirm || locale.ui.confirm || 'Confirm'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default AlertDialog;
