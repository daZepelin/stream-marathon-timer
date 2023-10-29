import { useState } from 'react';
import { Group, Code } from '@mantine/core';
import { IconPokerChip, IconHourglass, IconRefresh, IconX } from '@tabler/icons-react';
import { MantineLogo } from '@mantine/ds';
import classes from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';

const data = [
  // { link: '/dashboard/subathon-timer', label: 'Dashboard', icon: IconLayoutCollage },
  { link: '/dashboard/subathon-timer', label: 'Subathon', icon: IconHourglass },
  { link: '/dashboard/lucky-wheel', label: 'Lucky wheel', icon: IconPokerChip, disabled: true },
];

export function Navbar() {
  const [active, setActive] = useState('Subathon');
  const navigate = useNavigate();
  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      data-disabled={item.disabled || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
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
          <MantineLogo size={28} />
          <Code fw={700}>v3.1.2</Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a href='#' className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconRefresh className={classes.linkIcon} stroke={1.5} />
          <span>Refresh</span>
        </a>

        <a href='#' className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconX className={classes.linkIcon} stroke={1.5} />
          <span>Close</span>
        </a>
      </div>
    </nav>
  );
}
