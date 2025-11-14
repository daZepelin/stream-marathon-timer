import { useContext, useState } from 'react';
import { Group, Code, Image, Switch, rem, useMantineTheme, InputLabel } from '@mantine/core';
import { IconPokerChip, IconHourglass, IconPasswordFingerprint } from '@tabler/icons-react';
import classes from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';
import TimerActiveSwitch from '../pages/subathon-timer/components/settings/timer/TimerActiveSwitch';
import { LogsCtx } from '../../../context/logs';

const data = [
  // { link: '/dashboard/subathon-timer', label: 'Dashboard', icon: IconLayoutCollage },
  {
    link: '/dashboard/subathon-timer',
    label: (
      <div style={{ position: 'relative' }}>
        Subathon{' '}
        <div style={{ position: 'absolute', right: -90, top: 0, zIndex: 999 }}>
          <TimerActiveSwitch />
        </div>
      </div>
    ),
    icon: IconHourglass,
  },
  { link: '/dashboard/authentification', label: 'Authentification', icon: IconPasswordFingerprint },
  { link: '/dashboard/lucky-wheel', label: 'Lucky wheel', icon: IconPokerChip, disabled: true },
];

export function Navbar() {
  const theme = useMantineTheme();
  const { enabled, setEnabled } = useContext(LogsCtx);
  const [active, setActive] = useState('/dashboard/subathon-timer');
  const navigate = useNavigate();
  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.link === active || undefined}
      data-disabled={item.disabled || undefined}
      href={item.link}
      key={item.link}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.link);
        navigate(item.link);
      }}>
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  const playIcon = (
    <svg
      style={{ width: rem(20), height: rem(20) }}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke={theme.colors.blue[8]}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon icon-tabler icons-tabler-outline icon-tabler-logs'>
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M4 12h.01' />
      <path d='M4 6h.01' />
      <path d='M4 18h.01' />
      <path d='M8 18h2' />
      <path d='M8 12h2' />
      <path d='M8 6h2' />
      <path d='M14 6h6' />
      <path d='M14 12h6' />
      <path d='M14 18h6' />
    </svg>
  );
  // <IconLogs style={{ width: rem(20), height: rem(20) }} stroke={2.5} color={theme.colors.blue[6]} />;

  const pauseIcon = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      style={{ width: rem(20), height: rem(20) }}
      stroke={theme.colors.red[4]}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='icon icon-tabler icons-tabler-outline icon-tabler-logs'>
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M4 12h.01' />
      <path d='M4 6h.01' />
      <path d='M4 18h.01' />
      <path d='M8 18h2' />
      <path d='M8 12h2' />
      <path d='M8 6h2' />
      <path d='M14 6h6' />
      <path d='M14 12h6' />
      <path d='M14 18h6' />
    </svg>
    // <IconLogs style={{ width: rem(20), height: rem(20) }} stroke={2.5} color={theme.colors.yellow[4]} />
  );

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify='space-between'>
          <Image src='https://i.imgur.com/UGhEPZ1.png' h='xl' />
          <Code fw={700}>v{APP_VERSION}</Code>
        </Group>
        {links}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}>
        <Switch
          id='timer-switch'
          checked={enabled}
          onChange={(e) => {
            e.stopPropagation();
            setEnabled(e.currentTarget.checked);
          }}
          size='md'
          color='dark.4'
          onLabel={playIcon}
          offLabel={pauseIcon}
        />
        <InputLabel htmlFor='timer-switch'>Toggle Debug Logging</InputLabel>
      </div>
    </nav>
  );
}
