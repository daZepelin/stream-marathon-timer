import { useState } from 'react';
import { Group, Code, Image } from '@mantine/core';
import { IconPokerChip, IconHourglass, IconRefresh, IconX, IconPasswordFingerprint } from '@tabler/icons-react';
import classes from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';
import TimerActiveSwitch from '../pages/subathon-timer/components/settings/timer/TimerActiveSwitch';

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

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify='space-between'>
          <Image src='https://i.imgur.com/UGhEPZ1.png' h='xl' />
          <Code fw={700}>v{APP_VERSION}</Code>
        </Group>
        {links}
      </div>
    </nav>
  );
}
