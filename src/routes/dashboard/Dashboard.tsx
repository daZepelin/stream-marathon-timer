import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDonations } from '../../hooks/useDonations';
import { Navbar } from './navbar/Navbar';
import { AppShell, AppShellNavbar, Container, SimpleGrid } from '@mantine/core';

function Dashboard() {
  const [input, setInput] = useState('');
  const [streamLabsAuthKey, setStreamLabsAuthKey] = useState('');
  const [streamElementsJWT, setStreamElementsJWT] = useState('');

  const { donations } = useDonations({ streamLabsAuthKey, streamElementsJWT, newDonation: (donation) => {} });

  return (
    <AppShell navbar={{ width: 300, breakpoint: 'sm' }} padding='md'>
      <AppShell.Navbar withBorder>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main >
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default Dashboard;
