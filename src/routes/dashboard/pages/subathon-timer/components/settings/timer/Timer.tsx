import {
  Button,
  Fieldset,
  Flex,
  Group,
  InputDescription,
  NumberInput,
  Paper,
  Space,
  Switch,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { IconCheck, IconClockEdit, IconClockPlus, IconMinus, IconPencil, IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import classes from './Timer.module.css';
import useSubathonTime from '../../../../../../../hooks/useSubathonTime';
import useSubathonTimerConfig from '../../../../../../../hooks/useSubathonTimerConfig';
import TimerActiveSwitch from './TimerActiveSwitch';
import SpecialMultiplierActiveSwitch from './SpecialMultiplierActiveSwitch';
import { DEFAULT_DONATION_SOURCE_TOGGLES, IDonationSourceToggles, ISpecialMultiplier } from '../../../../../../../types/config';

function Timer() {
  const theme = useMantineTheme();
  const { specialMultiplier, setSpecialMultiplier, subathonTimerMultiplierData, setSubathonTimerMultiplierData } =
    useSubathonTimerConfig();
  const { subathonTime, setSubathonTime } = useSubathonTime();
  const [timerMultData, setTimerMultData] = useState<{ minutes: number; amount: number }>({ minutes: 1, amount: 1 });
  const [timerValue, setTimerValue] = useState<number>(0);
  const [timerValueAdd, setTimerValueAdd] = useState<number>(0);
  const [specialMultiplierInput, setSpecialMultiplierInput] = useState<ISpecialMultiplier>({
    multiplier: 1,
    word: [],
    active: false,
  });

  useEffect(() => {
    setTimerValue(Math.floor((subathonTime ?? 0) / 60));
  }, []);

  useEffect(() => {
    setTimerMultData({
      minutes: subathonTimerMultiplierData.minutes ?? 1,
      amount: subathonTimerMultiplierData.amount ?? 1,
    });
  }, [subathonTimerMultiplierData]);

  const mergedDonationToggles: IDonationSourceToggles = {
    streamLabs: {
      ...DEFAULT_DONATION_SOURCE_TOGGLES.streamLabs,
      ...(subathonTimerMultiplierData.donationSourceToggles?.streamLabs ?? {}),
    },
    streamElements: {
      ...DEFAULT_DONATION_SOURCE_TOGGLES.streamElements,
      ...(subathonTimerMultiplierData.donationSourceToggles?.streamElements ?? {}),
    },
  };

  const setToggle = (
    platform: keyof IDonationSourceToggles,
    key: string,
    value: boolean,
  ) => {
    setSubathonTimerMultiplierData({
      ...subathonTimerMultiplierData,
      donationSourceToggles: {
        ...mergedDonationToggles,
        [platform]: {
          ...(mergedDonationToggles as any)[platform],
          [key]: value,
        },
      },
    });
  };

  useEffect(() => {
    setSpecialMultiplierInput(specialMultiplier);
  }, [specialMultiplier]);

  return (
    <div>
      <Flex py='xs' direction={'column'} gap='md' justify={'flex-start'}>
        <Fieldset legend='Timer' style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', right: 20, top: 10 }}>
            <TimerActiveSwitch />
          </div>
          <Flex align='flex-end' gap='md'>
            <NumberInput
              value={timerValue}
              onChange={(value) => setTimerValue(typeof value === 'number' ? value : 0)}
              variant='filled'
              label='Set time'
              description='minutes'
              placeholder='500'
              suffix='min'
              leftSection={<IconPencil />}
              rightSectionPointerEvents='auto'
              allowNegative={false}
            />
            <Button
              miw='120px'
              onClick={() => {
                setSubathonTime(timerValue * 60);
              }}
              leftSection={<IconClockEdit />}>
              Apply
            </Button>
          </Flex>
          <Flex align='flex-end' gap='md' pt='md'>
            <NumberInput
              value={timerValueAdd}
              onChange={(value) => setTimerValueAdd(typeof value === 'number' ? value : 0)}
              variant='filled'
              label='Add time'
              description='minutes'
              placeholder='10'
              suffix='min'
              leftSection={timerValueAdd >= 0 ? <IconPlus /> : <IconMinus />}
              rightSectionPointerEvents='auto'
              allowNegative={true}
            />
            <Button
              miw='120px'
              onClick={() => {
                setSubathonTime((subathonTime ?? 0) + timerValueAdd * 60);
              }}
              variant='default'
              leftSection={<IconClockPlus />}>
              Apply
            </Button>
          </Flex>
        </Fieldset>
        <Fieldset legend='Rate'>
          <InputDescription>
            Rate: {subathonTimerMultiplierData.minutes} minute per {subathonTimerMultiplierData.amount}€
          </InputDescription>
          <InputDescription>
            Multiplier: {subathonTimerMultiplierData.minutes / subathonTimerMultiplierData.amount}
          </InputDescription>
          <Space h='xs' />
          <Flex gap='md' direction={'column'}>
            <Paper shadow='sm' bg={theme.colors.dark[5]} radius='sm' p='xs'>
              <Text
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                }}>
                Add{' '}
                <NumberInput
                  value={timerMultData.minutes}
                  onChange={(value) =>
                    setTimerMultData({
                      ...timerMultData,
                      minutes: typeof value === 'number' ? value : 1,
                    })
                  }
                  className={classes.paragraphInput}
                  variant='filled'
                  placeholder='minutes'
                  hideControls
                  size='xs'
                />
                minutes to timer for every
                <NumberInput
                  value={timerMultData.amount}
                  onChange={(value) =>
                    setTimerMultData({
                      ...timerMultData,
                      amount: typeof value === 'number' ? value : 1,
                    })
                  }
                  className={classes.paragraphInput}
                  variant='filled'
                  placeholder='amount'
                  size='xs'
                  hideControls
                />
                € of donation received
              </Text>
            </Paper>
            <Button
              onClick={() => {
                setSubathonTimerMultiplierData({
                  ...subathonTimerMultiplierData,
                  ...timerMultData,
                });
              }}
              leftSection={<IconCheck />}>
              Apply
            </Button>
          </Flex>
        </Fieldset>

        <Fieldset legend='Donation Sources'>
          <InputDescription>
            Disable a donation type on a platform to avoid double-counting when you listen to both StreamLabs and StreamElements.
          </InputDescription>
          <Space h='xs' />
          <Group align='flex-start' grow>
            <Paper shadow='sm' bg={theme.colors.dark[5]} radius='sm' p='xs'>
              <Text fw={600} mb='xs'>StreamLabs</Text>
              <Flex direction='column' gap='xs'>
                <Switch
                  checked={mergedDonationToggles.streamLabs.donation}
                  onChange={(e) => setToggle('streamLabs', 'donation', e.currentTarget.checked)}
                  label='Donations'
                />
                <Switch
                  checked={mergedDonationToggles.streamLabs.superchat}
                  onChange={(e) => setToggle('streamLabs', 'superchat', e.currentTarget.checked)}
                  label='YouTube SuperChat'
                />
                <Switch
                  checked={mergedDonationToggles.streamLabs.stars}
                  onChange={(e) => setToggle('streamLabs', 'stars', e.currentTarget.checked)}
                  label='Facebook Stars'
                />
              </Flex>
            </Paper>

            <Paper shadow='sm' bg={theme.colors.dark[5]} radius='sm' p='xs'>
              <Text fw={600} mb='xs'>StreamElements</Text>
              <Flex direction='column' gap='xs'>
                <Switch
                  checked={mergedDonationToggles.streamElements.tip}
                  onChange={(e) => setToggle('streamElements', 'tip', e.currentTarget.checked)}
                  label='Tips'
                />
                <Switch
                  checked={mergedDonationToggles.streamElements.superchat}
                  onChange={(e) => setToggle('streamElements', 'superchat', e.currentTarget.checked)}
                  label='YouTube SuperChat'
                />
              </Flex>
            </Paper>
          </Group>
        </Fieldset>
        <Fieldset legend='Special Multiplier' style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', right: 20, top: 10 }}>
            <SpecialMultiplierActiveSwitch />
          </div>
          <Flex align='flex-end' gap='md' pt='md'>
            <Flex direction={'column'}>
              <TextInput
                value={specialMultiplierInput?.word}
                onChange={(e) => {
                  setSpecialMultiplierInput({
                    ...specialMultiplier,
                    word: e.currentTarget.value.replace(/\s/g, '').split(','),
                  });
                }}
                variant='filled'
                label='Includes word'
                description='If donation message includes...'
                placeholder='GIVEAWAY, TEST...'
              />

              <NumberInput
                value={specialMultiplierInput?.multiplier}
                onChange={(value) => {
                  setSpecialMultiplierInput({
                    ...specialMultiplier,
                    multiplier: typeof value === 'number' ? value : 1.0,
                  });
                }}
                variant='filled'
                label='Multiplier'
                description='...multiply the timer by'
                placeholder='0.5'
                rightSectionPointerEvents='auto'
                allowNegative={false}
              />
            </Flex>
            <Button
              miw='120px'
              onClick={() => {
                setSpecialMultiplier(specialMultiplierInput);
              }}
              variant='default'
              leftSection={<IconCheck />}>
              Apply
            </Button>
          </Flex>
        </Fieldset>
      </Flex>
    </div>
  );
}

export default Timer;
