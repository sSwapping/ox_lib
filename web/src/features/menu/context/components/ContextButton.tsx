import { Box, Button, createStyles, Group, HoverCard, Image, Progress, Stack, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import { ContextMenuProps, Option } from '../../../../typings';
import { fetchNui } from '../../../../utils/fetchNui';
import { isIconUrl } from '../../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import MarkdownComponents from '../../../../config/MarkdownComponents';
import LibIcon from '../../../../components/LibIcon';

const openMenu = (id: string | undefined) => {
  fetchNui<ContextMenuProps>('openContext', { id: id, back: false });
};

const clickContext = (id: string) => {
  fetchNui('clickContext', id);
};

const useStyles = createStyles((theme, params: { disabled?: boolean; readOnly?: boolean }, getRef) => ({
  inner: {
    justifyContent: 'flex-start',
    height: '100%',
  },
  label: {
    width: '100%',
    color: theme.colors.gray[4],
    whiteSpace: 'pre-wrap',
    fontWeight: 500,
    fontSize: 15,
    fontFamily: 'Roboto, sans-serif',
    lineHeight: 1,
  },
  button: {
    height: 'fit-content',
    minHeight: 40,
    width: '100%',
    padding: '10px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid transparent',
    overflow: 'auto',
    borderRadius: 6,
    transition: 'all 0.2s ease',
    position: 'relative',
    '&:hover': {
      backgroundColor: params.readOnly ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.08)',
      borderColor: params.readOnly ? 'transparent' : 'rgba(255, 163, 233, 0.1)',
      cursor: params.readOnly ? 'default' : 'pointer',
      boxShadow: 'none',
      [`& .${getRef('activeAccent')}`]: {
        opacity: 1,
      },
      [`& .${getRef('label')}`]: {
        color: '#ffa3e9',
        fontWeight: 600,
      },
      [`& .${getRef('icon')}`]: {
        color: '#ffa3e9',
      },
      [`& .${getRef('contentWrapper')}`]: {
        paddingLeft: 12,
      },
    },
  },
  contentWrapper: {
    ref: getRef('contentWrapper'),
    width: '100%',
    transition: 'padding-left 0.2s ease',
  },
  activeAccent: {
    ref: getRef('activeAccent'),
    position: 'absolute',
    left: 8,
    top: '50%',
    transform: 'translateY(-50%)',
    height: 'clamp(18px, 70%, 36px)',
    width: 3,
    borderRadius: 4,
    backgroundColor: '#ffa3e9',
    boxShadow: '0 0 10px rgba(255, 163, 233, 0.5)',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  },
  iconImage: {
    maxWidth: 24,
    maxHeight: 24,
  },
  description: {
    color: theme.colors.gray[6],
    fontSize: 13,
    marginTop: 2,
  },
  dropdown: {
    padding: 10,
    backgroundColor: '#1a1a1a',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    fontSize: 14,
    maxWidth: 256,
    width: 'fit-content',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  },
  buttonStack: {
    gap: 0,
    flex: '1',
  },
  buttonGroup: {
    gap: 0,
    flexWrap: 'nowrap',
  },
  buttonIconContainer: {
    ref: getRef('icon'),
    display: 'flex',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    color: params.disabled ? 'rgba(255,255,255,0.3)' : theme.colors.gray[5],
    marginRight: 12,
    transition: 'color 0.2s ease',
  },
  buttonTitleText: {
    ref: getRef('label'),
    overflowWrap: 'break-word',
    lineHeight: 1,
    fontSize: 15,
    fontWeight: 500,
    color: theme.colors.gray[4],
    transition: 'color 0.2s ease, font-weight 0.2s ease',
  },
  buttonArrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
    opacity: 0.7,
    color: theme.colors.gray[6],
  },
}));

const ContextButton: React.FC<{
  option: [string, Option];
}> = ({ option }) => {
  const button = option[1];
  const buttonKey = option[0];
  const { classes } = useStyles({ disabled: button.disabled, readOnly: button.readOnly });

  return (
    <>
      <HoverCard
        position="right-start"
        disabled={button.disabled || !(button.metadata || button.image)}
        openDelay={200}
        shadow="md"
      >
        <HoverCard.Target>
          <Button
            classNames={{ inner: classes.inner, label: classes.label, root: classes.button }}
            onClick={() =>
              !button.disabled && !button.readOnly
                ? button.menu
                  ? openMenu(button.menu)
                  : clickContext(buttonKey)
                : null
            }
            variant="default"
            disabled={button.disabled}
          >
            <Box className={classes.activeAccent} />
            <Box className={classes.contentWrapper}>
              <Group position="apart" w="100%" noWrap>
                <Stack className={classes.buttonStack}>
                  {(button.title || Number.isNaN(+buttonKey)) && (
                    <Group className={classes.buttonGroup}>
                      {button?.icon && (
                        <Stack className={classes.buttonIconContainer}>
                          {typeof button.icon === 'string' && isIconUrl(button.icon) ? (
                            <img src={button.icon} className={classes.iconImage} alt="Missing img" />
                          ) : (
                            <LibIcon
                              icon={button.icon as IconProp}
                              fixedWidth
                              size="lg"
                              style={{ color: button.iconColor }}
                              animation={button.iconAnimation}
                            />
                          )}
                        </Stack>
                      )}
                      <Text className={classes.buttonTitleText}>
                        <ReactMarkdown components={MarkdownComponents}>{button.title || buttonKey}</ReactMarkdown>
                      </Text>
                    </Group>
                  )}
                  {button.description && (
                    <Text className={classes.description}>
                      <ReactMarkdown components={MarkdownComponents}>{button.description}</ReactMarkdown>
                    </Text>
                  )}
                  {button.progress !== undefined && (
                    <Progress value={button.progress} size="sm" color={button.colorScheme || 'teal'} />
                  )}
                </Stack>
                {(button.menu || button.arrow) && button.arrow !== false && (
                  <Stack className={classes.buttonArrowContainer}>
                    <LibIcon icon="chevron-right" fixedWidth />
                  </Stack>
                )}
              </Group>
            </Box>
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown className={classes.dropdown}>
          {button.image && <Image src={button.image} />}
          {Array.isArray(button.metadata) ? (
            button.metadata.map(
              (
                metadata: string | { label: string; value?: any; progress?: number; colorScheme?: string },
                index: number
              ) => (
                <Stack spacing={2} key={`context-metadata-${index}`}>
                  <Text>
                    {typeof metadata === 'string' ? `${metadata}` : `${metadata.label}: ${metadata?.value ?? ''}`}
                  </Text>

                  {typeof metadata === 'object' && metadata.progress !== undefined && (
                    <Progress
                      value={metadata.progress}
                      size="sm"
                      color={metadata.colorScheme || button.colorScheme || 'teal'}
                    />
                  )}
                </Stack>
              )
            )
          ) : (
            <>
              {typeof button.metadata === 'object' &&
                Object.entries(button.metadata).map((metadata: { [key: string]: any }, index) => (
                  <Text key={`context-metadata-${index}`}>
                    {metadata[0]}: {metadata[1]}
                  </Text>
                ))}
            </>
          )}
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export default ContextButton;
