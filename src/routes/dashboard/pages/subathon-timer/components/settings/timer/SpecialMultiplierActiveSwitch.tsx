import { useMantineTheme, rem, Tooltip, Switch } from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import useSubathonTimerConfig from '../../../../../../../hooks/useSubathonTimerConfig';

function SpecialMultiplierActiveSwitch() {
  const theme = useMantineTheme();
  const { specialMultiplier, setSpecialMultiplier } = useSubathonTimerConfig();

  const activeIcon = (
    <IconCircleCheck style={{ width: rem(20), height: rem(20) }} stroke={2.5} color={theme.colors.blue[6]} />
  );

  const inactiveIcon = (
    <IconCircleX style={{ width: rem(20), height: rem(20) }} stroke={2.5} color={theme.colors.red[4]} />
  );

  return (
    <Tooltip label='Activate / deactivate special multiplier active'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}>
        <Switch
          checked={specialMultiplier?.active}
          onChange={(e) => {
            e.stopPropagation();
            setSpecialMultiplier({ ...specialMultiplier, active: e.currentTarget.checked });
          }}
          size='md'
          color='dark.4'
          onLabel={activeIcon}
          offLabel={inactiveIcon}
        />
      </div>
    </Tooltip>
  );
}

export default SpecialMultiplierActiveSwitch;
