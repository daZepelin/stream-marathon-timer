import { ActionIcon, Badge, CopyButton, Grid, Group, Input, Paper, Text, Title, Tooltip, rem, useMantineTheme } from '@mantine/core';
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
          px='lg'
          py='md'
          radius='lg'
          bg={theme.colors.dark[6]}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            position: 'relative',
          }}>
          
          <Group align='center' gap='lg'>
            <div>
              <Title order={2}>Subathon Timer</Title>
              <Text size='sm' c='dimmed'>
                Control the overlay and preview styling changes instantly.
              </Text>
            </div>
            <Badge color='blue' variant='light' radius='sm'>
              Live Preview
            </Badge>
          </Group>
          <Group align='center' gap='lg'>
            <Input.Wrapper size='xs' description='OBS source link'>
              <Input
                size='sm'
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
            <Paper
              radius='md'
              px='md'
              py={6}
              bg={theme.colors.dark[7]}
              style={{
                minWidth: 180,
                textAlign: 'center',
              }}>
              <div
                style={{
                  ...(displayStyle ? subathonTimerStyle : {}),
                  color: (subathonTimerStyle['-webkit-text-fill-color'] as string) || undefined,
                  WebkitTextFillColor: (subathonTimerStyle['-webkit-text-fill-color'] as string) || undefined,
                  WebkitTextStrokeColor: (subathonTimerStyle['-webkit-text-stroke-color'] as string) || undefined,
                  WebkitTextStrokeWidth: subathonTimerStyle['-webkit-text-stroke-width']
                    ? `${subathonTimerStyle['-webkit-text-stroke-width']}px`
                    : undefined,
                  textShadow: displayStyle
                    ? ` ${subathonTimerStyle['-webkit-text-stroke-width'] ?? 0}px 0 0 ${
                        subathonTimerStyle['-webkit-text-stroke-color'] ?? 'transparent'
                      },  ${subathonTimerStyle['-webkit-text-stroke-width'] ?? 0}px 0 0 ${
                        subathonTimerStyle['-webkit-text-stroke-color'] ?? 'transparent'
                      },  ${subathonTimerStyle['-webkit-text-stroke-width'] ?? 0}px 0 0 ${
                        subathonTimerStyle['-webkit-text-stroke-color'] ?? 'transparent'
                      },  ${subathonTimerStyle['-webkit-text-stroke-color'] ?? 'transparent'} ${
                        subathonTimerStyle['-webkit-text-stroke-color'] ?? 'transparent'
                      } 0 0`
                    : '',
                }}>
                {formatTime(subathonTime)}
              </div>
            </Paper>
          </Group>
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
