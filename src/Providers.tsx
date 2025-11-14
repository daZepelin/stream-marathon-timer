import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import React, { useState } from 'react';
import WebsocketProvider from './providers/WebsocketProvider';
import SubathonTimeProvider from './providers/SubathonTimeProvider';
import SubathonConfigProvider from './providers/SubathonConfigProvider';
import AuthentificationProvider from './providers/AuthentificationProvider';
import LogsProvider from './providers/LogsProvider';

const theme = createTheme({
  //   loader: 'oval',
  // Added Segoe UI Variable Text (Win11) to https://mantine.dev/theming/typography/#system-fonts
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Segoe UI Variable Text, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
  // added source-code-pro and SFMono-Regular
  fontFamilyMonospace:
    'source-code-pro, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
  components: {
    Checkbox: { styles: { input: { cursor: 'pointer' }, label: { cursor: 'pointer' } } },
    TextInput: { styles: { label: { marginTop: '0.5rem' } } },
    Select: { styles: { label: { marginTop: '0.5rem' } } },
    Loader: { defaultProps: { size: 'xl' } },
    Space: { defaultProps: { h: 'sm' } },
    Anchor: { defaultProps: { target: '_blank' } },
    Burger: { styles: { burger: { color: '--mantine-color-grey-6' } } },
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MantineProvider defaultColorScheme='dark' forceColorScheme='dark' theme={theme}>
        <AuthentificationProvider>
          <SubathonConfigProvider>
            <WebsocketProvider>
              <SubathonTimeProvider>
                <LogsProvider>{children}</LogsProvider>
              </SubathonTimeProvider>
            </WebsocketProvider>
          </SubathonConfigProvider>
        </AuthentificationProvider>
      </MantineProvider>
    </>
  );
};
