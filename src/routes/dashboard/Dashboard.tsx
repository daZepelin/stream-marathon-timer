import { Outlet } from 'react-router-dom';
import { Navbar } from './navbar/Navbar';
import { AppShell } from '@mantine/core';

function Dashboard() {
  
  return (
    <AppShell navbar={{ width: 250, breakpoint: 'sm' }} padding='md'>
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
