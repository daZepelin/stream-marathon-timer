import { Paper, Tabs, rem, useMantineTheme } from '@mantine/core';
import { IconAdjustmentsBolt, IconEyeCode } from '@tabler/icons-react';
import Style from './style/Style';

const Settings = () => {
  const theme = useMantineTheme();
  const iconStyle = { width: rem(16), height: rem(16) };
  return (
    <Paper withBorder shadow='sm' p='xs' radius='lg' bg={theme.colors.dark[7]}>
      <Tabs defaultValue='controls'>
        <Tabs.List>
          <Tabs.Tab value={'controls'} leftSection={<IconAdjustmentsBolt style={iconStyle} />}>
            Controls
          </Tabs.Tab>
          <Tabs.Tab value={'style'} leftSection={<IconEyeCode style={iconStyle} />}>
            Style
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value={'controls'}>Controls</Tabs.Panel>
        <Tabs.Panel value={'style'}>
          <Style />
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};

export default Settings;
