import { Group, Paper, Tabs, Text, Title, rem, useMantineTheme } from '@mantine/core';
import { IconClockFilled, IconEyeCode } from '@tabler/icons-react';
import Style from './style/Style';
import Timer from './timer/Timer';
import { HEADER_HEIGHT } from '../../../../../../services/utils';

const Settings = () => {
  const theme = useMantineTheme();
  const iconStyle = { width: rem(16), height: rem(16) };
  return (
    <Paper
      withBorder
      shadow='sm'
      p='md'
      radius='lg'
      bg={theme.colors.dark[7]}
      style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)`, overflowY: 'auto' }}>
      <Group justify='space-between' mb='md'>
        <div>
          <Title order={4}>Settings</Title>
          <Text size='xs' c='dimmed'>
            Tune timer behavior and style.
          </Text>
        </div>
      </Group>
      <Tabs defaultValue='controls' variant='pills' radius='md'>
        <Tabs.List grow>
          <Tabs.Tab value={'controls'} leftSection={<IconClockFilled style={iconStyle} />}>
            Timer
          </Tabs.Tab>
          <Tabs.Tab value={'style'} leftSection={<IconEyeCode style={iconStyle} />}>
            Style
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value={'controls'}>
          <Timer />
        </Tabs.Panel>
        <Tabs.Panel value={'style'}>
          <Style />
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};

export default Settings;
