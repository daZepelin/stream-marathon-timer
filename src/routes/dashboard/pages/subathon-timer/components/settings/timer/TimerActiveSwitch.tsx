import { useMantineTheme, rem, Tooltip, Switch } from '@mantine/core';
import { IconClockPlay, IconClockPause } from '@tabler/icons-react';
import useSubathonTime from '../../../../../../../hooks/useSubathonTime';

function TimerActiveSwitch() {
  const theme = useMantineTheme();
  const { timerActive, setTimerActive } = useSubathonTime();

  const playIcon = (
    <IconClockPlay style={{ width: rem(20), height: rem(20) }} stroke={2.5} color={theme.colors.blue[6]} />
  );

  const pauseIcon = (
    <IconClockPause style={{ width: rem(20), height: rem(20) }} stroke={2.5} color={theme.colors.yellow[4]} />
  );
  return (
    <Tooltip label='Start / Resume the timer'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}>
        <Switch
          checked={timerActive}
          onChange={(e) => {
            e.stopPropagation();
            setTimerActive(e.currentTarget.checked);
          }}
          size='md'
          color='dark.4'
          onLabel={playIcon}
          offLabel={pauseIcon}
        />
      </div>
    </Tooltip>
  );
}

export default TimerActiveSwitch;
