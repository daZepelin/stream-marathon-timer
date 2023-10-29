import {
  Button,
  Fieldset,
  Flex,
  InputDescription,
  NumberInput,
  Paper,
  Space,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { IconCheck, IconClockEdit, IconClockPlus, IconPencil, IconPlus } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';
import classes from './Timer.module.css';
import { SubathonTimeCtx, SubathonTimerConfigCtx } from '../../../../../../../context/subathon-time';

function Timer() {
  const theme = useMantineTheme();
  const { subathonTimerMultiplierData, setSubathonTimerMultiplierData } = useContext(SubathonTimerConfigCtx);
  const { subathonTime, setSubathonTime, addTime } = useContext(SubathonTimeCtx);
  const [timerMultData, setTimerMultData] = useState<{ minutes: number; amount: number }>({ minutes: 1, amount: 1 }); // [TODO
  const [setTimerValue, setTimerValueState] = useState<number>(0);
  const [setTimerValueAdd, setTimerValueAddState] = useState<number>(0);

  useEffect(() => {
    setTimerValueState(Math.floor((subathonTime ?? 0) / 60));
  }, []);
  return (
    <div>
      <Flex py='xs' direction={'column'} gap='md' justify={'flex-start'}>
        <Fieldset legend='Timer'>
          <Flex align='flex-end' gap='md'>
            <NumberInput
              value={setTimerValue}
              onChange={(value) => setTimerValueState(typeof value === 'number' ? value : 0)}
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
              onClick={() => {
                setSubathonTime(setTimerValue * 60);
              }}
              leftSection={<IconClockEdit />}>
              Apply
            </Button>
          </Flex>
          <Flex align='flex-end' gap='md' pt='md'>
            <NumberInput
              value={setTimerValueAdd}
              onChange={(value) => setTimerValueAddState(typeof value === 'number' ? value : 0)}
              variant='filled'
              label='Add time'
              description='minutes'
              placeholder='10'
              suffix='min'
              leftSection={<IconPlus />}
              rightSectionPointerEvents='auto'
              allowNegative={false}
            />
            <Button
              onClick={() => {
                addTime(setTimerValueAdd * 60);
                setTimerValueAddState(0);
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
                      minutes: typeof value === 'number' ? value : 0,
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
                      amount: typeof value === 'number' ? value : 0,
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
                console.log('timerMultData', timerMultData);
                setSubathonTimerMultiplierData(timerMultData);
              }}
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
