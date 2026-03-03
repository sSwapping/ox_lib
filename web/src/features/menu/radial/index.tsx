import { Box, createStyles, Text, Transition } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import { fetchNui } from '../../../utils/fetchNui';
import { isIconUrl } from '../../../utils/isIconUrl';
import ScaleFade from '../../../transitions/ScaleFade';
import type { RadialMenuItem } from '../../../typings';
import { useLocales } from '../../../providers/LocaleProvider';
import LibIcon from '../../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '65%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  menuLayer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  itemContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 70,
    height: 70,
    marginTop: -35,
    marginLeft: -35,
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141414',
    borderRadius: theme.radius.md,
    color: 'rgba(255, 255, 255, 0.6)',
    transition: 'all 250ms ease-out',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 163, 233, 0.4)',
    overflow: 'hidden',
    transform: 'translate(var(--rad-x, 0px), var(--rad-y, 0px))',

    '&:hover, &:focus': {
      transform: 'translate(var(--rad-x, 0px), calc(var(--rad-y, 0px) - 5px)) scale(1.1)',
      color: '#ffa3e9',
      backgroundColor: '#2a2a30',
      boxShadow: 'inset 0 2px 8px rgba(255, 163, 233, 0.7)',
      cursor: 'pointer',
      outline: 'none',
    },
  },
  itemContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIcon: {
    fontSize: 28,
  },
  centerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    cursor: 'pointer',
  },
  centerText: {
    color: '#fff3fc',
    fontFamily: "'Geist', 'Roboto Condensed', sans-serif",
    fontSize: 22,
    fontWeight: 700,
    textTransform: 'uppercase',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    letterSpacing: 0.8,
    whiteSpace: 'nowrap',
  },
  centerSubText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginTop: 4,
    textTransform: 'uppercase',
  },
}));

const PAGE_ITEMS = 8;
const RADIUS = 200;

const RadialMenu: React.FC = () => {
  const { classes } = useStyles();
  const { locale } = useLocales();
  const [visible, setVisible] = useState(false);
  const [menuItems, setMenuItems] = useState<RadialMenuItem[]>([]);
  const [menu, setMenu] = useState<{
    items: RadialMenuItem[];
    sub?: boolean;
    page: number;
    id?: string;
    label?: string;
  }>({
    items: [],
    sub: false,
    page: 1,
  });
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const changePage = async (increment?: boolean) => {
    setVisible(false);
    const didTransition: boolean = await fetchNui('radialTransition');
    if (!didTransition) return;
    setVisible(true);
    setMenu({ ...menu, page: increment ? menu.page + 1 : menu.page - 1 });
  };

  useEffect(() => {
    if (menu.items.length <= PAGE_ITEMS) return setMenuItems(menu.items);
    const items = menu.items.slice(
      PAGE_ITEMS * (menu.page - 1) - (menu.page - 1),
      PAGE_ITEMS * menu.page - menu.page + 1
    );
    if (PAGE_ITEMS * menu.page - menu.page + 1 < menu.items.length) {
      items[items.length - 1] = {
        icon: 'ellipsis-h',
        label: locale.ui.more,
        isMore: true,
      };
    }
    setMenuItems(items);
  }, [menu.items, menu.page]);

  useNuiEvent(
    'openRadialMenu',
    async (
      data:
        | {
            items: RadialMenuItem[];
            sub?: boolean;
            option?: string;
            label?: string;
          }
        | false
    ) => {
      if (!data) return setVisible(false);
      let initialPage = 1;
      if (data.option) {
        data.items.findIndex(
          (item, index) => item.menu == data.option && (initialPage = Math.floor(index / PAGE_ITEMS) + 1)
        );
      }
      setMenu({ ...data, page: initialPage });
      setVisible(true);
    }
  );

  useNuiEvent('refreshItems', (data: RadialMenuItem[]) => {
    setMenu({ ...menu, items: data });
  });

  const handleCenterClick = async () => {
    if (menu.page > 1) await changePage();
    else {
      if (menu.sub) fetchNui('radialBack');
      else {
        setVisible(false);
        fetchNui('radialClose');
      }
    }
  };

  return (
    <Box className={classes.wrapper}>
      <ScaleFade visible={visible}>
        <div className={classes.menuLayer}>
          {menuItems.map((item, index) => {
            const angleStep = 360 / Math.max(menuItems.length, 1);
            const angleDeg = -90 + index * angleStep;
            const angleRad = angleDeg * (Math.PI / 180);

            const x = Math.cos(angleRad) * RADIUS;
            const y = Math.sin(angleRad) * RADIUS;

            return (
              <Box
                key={index}
                className={classes.itemContainer}
                style={
                  {
                    '--rad-x': `${x}px`,
                    '--rad-y': `${y}px`,
                  } as any
                }
                onMouseEnter={() => setHoveredLabel(item.label)}
                onMouseLeave={() => setHoveredLabel(null)}
                onClick={async () => {
                  const clickIndex = menu.page === 1 ? index : PAGE_ITEMS * (menu.page - 1) - (menu.page - 1) + index;
                  if (!item.isMore) fetchNui('radialClick', clickIndex);
                  else {
                    await changePage(true);
                  }
                }}
              >
                <div className={classes.itemContent}>
                  {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
                    <img src={item.icon} alt={item.label} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                  ) : (
                    <LibIcon icon={item.icon as IconProp} fixedWidth className={classes.itemIcon} />
                  )}
                </div>
              </Box>
            );
          })}

          <div className={classes.centerContainer} onClick={handleCenterClick}>
            <Text className={classes.centerText}>{hoveredLabel || menu.label || (menu.sub ? 'TERUG' : 'SLUITEN')}</Text>
            {!hoveredLabel && <Text className={classes.centerSubText}>{menu.page > 1 ? `PAGE ${menu.page}` : ''}</Text>}
          </div>
        </div>
      </ScaleFade>
    </Box>
  );
};

export default RadialMenu;
