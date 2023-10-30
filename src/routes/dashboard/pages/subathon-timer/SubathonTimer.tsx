import { ActionIcon, CopyButton, Grid, Input, Paper, Title, Tooltip, rem, useMantineTheme } from '@mantine/core';
import Settings from './components/settings/Settings';
import { formatTime } from '../../../../services/utils';
import useSubathonTime from '../../../../hooks/useSubathonTime';
import useSubathonTimerConfig from '../../../../hooks/useSubathonTimerConfig';
import DonationLogs from './components/donation-logs/DonationLogs';
import { useEffect, useState } from 'react';
import { IconCheck, IconCopy } from '@tabler/icons-react';

export const SubathonTimer = () => {
  const { subathonTime } = useSubathonTime();
  const { subathonTimerStyle } = useSubathonTimerConfig();
  const [displayStyle, setDisplayStyle] = useState<boolean>(false);
  const [displayTimeout, setDisplayTimeout] = useState<number | null>(null);
  const theme = useMantineTheme();

  useEffect(() => {
    if (displayTimeout) clearTimeout(displayTimeout);
    setDisplayStyle(true);
    let timeout = setTimeout(() => {
      setDisplayStyle(false);
    }, 3000);

    setDisplayTimeout(timeout);

    return () => {
      if (displayTimeout) clearTimeout(displayTimeout);
    };
  }, [subathonTimerStyle]);

  return (
    <Grid grow align='flex-start'>
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
            justifyContent: 'flex-start',
            overflow: 'hidden',
            gap: 10,
          }}>
          <Title
            order={2}
            style={{
              lineHeight: '57px',
              overflow: 'hidden',
            }}>
            Subathon Timer
          </Title>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Input.Wrapper size='xs' description='OBS source link'>
              <Input
                size='xs'
                rightSectionPointerEvents='all'
                value={'http://localhost:1427/subathon-timer'}
                rightSection={
                  <CopyButton value='http://localhost:1427/subathon-timer' timeout={2000}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position='right'>
                        <ActionIcon color={copied ? 'teal' : 'gray'} variant='subtle' onClick={copy}>
                          {copied ? <IconCheck style={{ width: rem(16) }} /> : <IconCopy style={{ width: rem(16) }} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                }
              />
            </Input.Wrapper>
          </div>
          <div
            style={{
              height: '57px',
              overflow: 'hidden',
              position: 'absolute',
              right: 30,
            }}>
            <div
              style={{
                lineHeight: '57px',
                ...(displayStyle ? subathonTimerStyle : {}),
                textShadow: displayStyle
                  ? `${subathonTimerStyle['font-border-width']}px 0 0 ${subathonTimerStyle['font-border-color']},  ${subathonTimerStyle['font-border-width']}px 0 0 ${subathonTimerStyle['font-border-color']},  ${subathonTimerStyle['font-border-width']}px 0 0 ${subathonTimerStyle['font-border-color']},  ${subathonTimerStyle['font-border-color']} ${subathonTimerStyle['font-border-color']} 0 0`
                  : '',
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
