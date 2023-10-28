import { Grid, Paper, SimpleGrid, Title, useMantineTheme } from '@mantine/core';
import React, { useContext } from 'react';
import Settings from './components/settings/Settings';
import DonationLogs from './components/DonationLogs';
import { formatTime } from '../../../../services/utils';
import { SubathonTimeCtx, SubathonTimerStyleCtx } from '../../../../context/subathon-time';

export const SubathonTimer = () => {
  const { subathonTime } = useContext(SubathonTimeCtx);
  const { subathonTimerStyle } = useContext(SubathonTimerStyleCtx);
  const theme = useMantineTheme();
  return (
    <Grid grow align='center'>
      <Grid.Col span={12}>
        <Paper
          withBorder
          shadow='sm'
          px='xs'
          radius='lg'
          bg={theme.colors.dark[6]}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}>
          <Title order={2}>Subathon Timer</Title>
          <div
            style={{
              height: '57px',
              overflow: 'hidden',
            }}>
            <div
              style={{
                lineHeight: '57px',
                ...subathonTimerStyle,
                textShadow: ` ${subathonTimerStyle['font-border-width']}px 0 0 ${subathonTimerStyle['font-border-color']},  ${subathonTimerStyle['font-border-width']}px 0 0 ${subathonTimerStyle['font-border-color']},  ${subathonTimerStyle['font-border-width']}px 0 0 ${subathonTimerStyle['font-border-color']},  ${subathonTimerStyle['font-border-color']} ${subathonTimerStyle['font-border-color']} 0 0`,
              }}>
              {formatTime(subathonTime)}
            </div>
          </div>
        </Paper>
      </Grid.Col>
      <Grid.Col span={6}>
        <Settings />
      </Grid.Col>
      <Grid.Col span={6}>
        <DonationLogs />
      </Grid.Col>
    </Grid>
  );
};
