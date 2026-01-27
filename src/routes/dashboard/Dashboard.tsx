import { Outlet } from 'react-router-dom';
import { Navbar } from './navbar/Navbar';
import { AppShell, useMantineTheme } from '@mantine/core';

function Dashboard() {
  const theme = useMantineTheme();

  return (
    <AppShell
      navbar={{ width: 280, breakpoint: 'sm' }}
      padding='lg'
      styles={{
        main: {
          backgroundColor: theme.colors.dark[8],
          minHeight: '100vh',
        },
      }}>
      <AppShell.Navbar withBorder>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default Dashboard;
