import {
  Anchor,
  Box,
  Button,
  Center,
  Code,
  Fieldset,
  Flex,
  Image,
  InputDescription,
  InputLabel,
  Paper,
  PasswordInput,
  SegmentedControl,
  Space,
  Title,
  useMantineTheme,
} from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { IconCheck, IconPlugConnected, IconPlugConnectedX } from '@tabler/icons-react';
import { AuthentificationCtx } from '../../../../context/authentification';
import { useDonations } from '../../../../hooks/useDonations';

const STREAM_LABS_DASHBOARD_URL = 'https://streamlabs.com/dashboard#/settings/api-settings';
const STREAM_ELEMENTS_DASHBOARD_URL = 'https://streamelements.com/dashboard/account/channels';

const INACTIVE_OVERLAY_STYLE = {
  zIndex: 100,
  width: 'calc(100% + 10px)',
  height: 'calc(100% + 10px)',
  transition: 'opacity 0.35s ease-in-out',
  backdropFilter: 'blur(2px) grayscale(100%)',
  position: 'absolute',
  top: -5,
  left: -5,
  borderRadius: 10,
} as React.CSSProperties;

const SEGMENTED_CONTROL_DATA = [
  {
    value: 'streamLabs',
    label: (
      <Center>
        <Flex gap='md' align='center'>
          <Image src='https://i.imgur.com/hMMa1O9.png' h='md'></Image>
          <Box>Stream Labs</Box>
        </Flex>
      </Center>
    ),
  },
  {
    value: 'streamElements',
    label: (
      <Center>
        <Flex gap='md' align='center'>
          <Image src='https://i.imgur.com/LxsoXps.png' h='md'></Image>
          <Box>Stream Elements</Box>
        </Flex>
      </Center>
    ),
  },
  { value: 'both', label: 'Both' },
];

function AuthentificationPanel() {
  const theme = useMantineTheme();
  const { streamLabsAuthKey, setStreamLabsAuthKey, streamElementsJWT, setStreamElementsJWT, platform, setPlatform } =
    useContext(AuthentificationCtx);
  const [streamLabsAuthKeyInput, setStreamLabsAuthKeyInput] = useState<string>('');
  const [streamElementsJWTInput, setStreamElementsJWTInput] = useState<string>('');
  const { socketStatuses } = useDonations();
  // const [streamLabsConnected, setStreamLabsConnected] = useState<boolean>(false);
  // const [streamElementsConnected, setStreamElementsConnected] = useState<boolean>(false);

  useEffect(() => {
    setStreamLabsAuthKeyInput(streamLabsAuthKey);
    setStreamElementsJWTInput(streamElementsJWT);
  }, [streamLabsAuthKey, streamElementsJWT]);

  // useEffect(() => {
  //   console.log('changed socket', streamLabsSocket?.connected, streamElementsSocket?.connected);
  //   setStreamLabsConnected(streamLabsSocket?.connected || false);
  //   setStreamElementsConnected(streamElementsSocket?.connected || false);
  // }, [streamLabsSocket, streamElementsSocket]);

  return (
    <div>
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
        <Title
          style={{
            lineHeight: '57px',
            overflow: 'hidden',
          }}
          order={2}>
          Authentification
        </Title>
      </Paper>
      <Space />
      <Fieldset legend='Authentication tokens'>
        <Flex direction='column' gap='xs' style={{ position: 'relative' }}>
          <div>
            <InputLabel>Steam Labs</InputLabel>
            <InputDescription>
              Stream Labs token. Go to{' '}
              <Anchor target='_blank' size='sm' href={STREAM_LABS_DASHBOARD_URL}>
                Your Dashboard
              </Anchor>
              , click on <Code>API Tokens</Code> and copy <Code>You Socket API Token</Code>
            </InputDescription>
          </div>
          <Flex direction='row' gap='xs' style={{ width: '100%' }}>
            <PasswordInput
              value={streamLabsAuthKeyInput}
              onChange={(e) => {
                setStreamLabsAuthKeyInput(e.currentTarget.value);
              }}
              style={{ width: '50%' }}></PasswordInput>
            <Button onClick={() => setStreamLabsAuthKey(streamLabsAuthKeyInput)} leftSection={<IconCheck />}>
              Apply
            </Button>
            <Flex gap='sm' align='center'>
              Status:
              {socketStatuses.streamLabs == 'connected' ? (
                <IconPlugConnected color={theme.colors.green[3]} />
              ) : (
                <IconPlugConnectedX color={theme.colors.red[5]} />
              )}
            </Flex>
          </Flex>
          <div
            style={{
              ...INACTIVE_OVERLAY_STYLE,
              opacity: platform !== 'both' && platform !== 'streamLabs' ? 1 : 0,
              pointerEvents: platform !== 'both' && platform !== 'streamLabs' ? 'all' : 'none',
            }}></div>
        </Flex>
        <Space />
        <Flex direction='column' gap='xs' style={{ position: 'relative' }}>
          <div>
            <InputLabel>Steam Elements</InputLabel>
            <InputDescription>
              Stream Elements JWT Token. Go to{' '}
              <Anchor target='_blank' size='sm' href={STREAM_ELEMENTS_DASHBOARD_URL}>
                Your Dashboard
              </Anchor>{' '}
              and copy <Code>JWT Token</Code>
            </InputDescription>
          </div>
          <Flex direction='row' gap='xs' style={{ width: '100%' }}>
            <PasswordInput
              value={streamElementsJWTInput}
              onChange={(e) => {
                setStreamElementsJWTInput(e.currentTarget.value);
              }}
              style={{ width: '50%' }}></PasswordInput>
            <Button onClick={() => setStreamElementsJWT(streamElementsJWTInput)} leftSection={<IconCheck />}>
              Apply
            </Button>
            <Flex gap='sm' align='center'>
              Status:
              {socketStatuses.streamElements == 'connected' ? (
                <IconPlugConnectedX color={theme.colors.yellow[3]} />
              ) : (
                <>
                  {socketStatuses.streamElements == 'authenticated' ? (
                    <IconPlugConnected color={theme.colors.green[3]} />
                  ) : (
                    <IconPlugConnectedX color={theme.colors.red[5]} />
                  )}
                </>
              )}
            </Flex>
          </Flex>
          <div
            style={{
              ...INACTIVE_OVERLAY_STYLE,
              opacity: platform !== 'both' && platform !== 'streamElements' ? 1 : 0,
              pointerEvents: platform !== 'both' && platform !== 'streamElements' ? 'all' : 'none',
            }}></div>
        </Flex>
        <Space />
        <Flex direction='column' gap='xs'>
          <div>
            <InputLabel>Used platform</InputLabel>
            <InputDescription>Select donations / alerts platform to be used</InputDescription>
          </div>
          <SegmentedControl
            value={platform}
            onChange={(value) => setPlatform(value as 'streamLabs' | 'streamElements' | 'both')}
            data={SEGMENTED_CONTROL_DATA}
          />
        </Flex>
      </Fieldset>
    </div>
  );
}

export default AuthentificationPanel;
