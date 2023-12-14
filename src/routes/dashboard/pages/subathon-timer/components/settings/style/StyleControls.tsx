import React, { RefObject, useContext, useEffect, useState } from 'react';
import { SubathonTimerConfigCtx } from '../../../../../../../context/subathon-time';
import {
  ActionIcon,
  Anchor,
  Button,
  ColorInput,
  Dialog,
  Fieldset,
  Group,
  Select,
  Slider,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFilePlus, IconLetterCase } from '@tabler/icons-react';
import useFontImports from '../../../../../../../hooks/useFontImports';

const StyleControls = () => {
  const theme = useMantineTheme();
  const { subathonTimerStyle, setSubathonTimerStyle } = useContext(SubathonTimerConfigCtx);
  const [fontDialogOpen, { toggle: fontDialogToggle, close: fontDialogClose }] = useDisclosure(false);
  const { addFont, fonts } = useFontImports();
  const [fontInput, setFontInput] = useState('' as string);

  return (
    <div>
      <Fieldset legend='Timer style'>
        <ColorInput
          label='Font color'
          description='-webkit-text-fill-color'
          // placeholder='Input placeholder'
          value={subathonTimerStyle['-webkit-text-fill-color'] as string}
          onChange={(value) => setSubathonTimerStyle({ ...subathonTimerStyle, ['-webkit-text-fill-color']: value })}
        />
        <ColorInput
          label='Border color'
          description='-webkit-text-stroke-color'
          value={subathonTimerStyle['-webkit-text-stroke-color'] as string}
          onChange={(value) => setSubathonTimerStyle({ ...subathonTimerStyle, '-webkit-text-stroke-color': value })}
        />
        <Text size='sm' mt='xs'>
          Stroke width
        </Text>
        <Text c='dimmed' size='xs'>
          -webkit-text-stroke-width
        </Text>
        <Slider
          value={parseFloat((subathonTimerStyle['-webkit-text-stroke-width'] ?? 0) as string)}
          min={0}
          max={7}
          step={0.1}
          label={(value) => `${value}px`}
          onChange={(value) => setSubathonTimerStyle({ ...subathonTimerStyle, '-webkit-text-stroke-width': value })}
        />
        <Text size='sm' mt='xs'>
          Font size
        </Text>
        <Text c='dimmed' size='xs'>
          font-size
        </Text>
        <Slider
          value={parseInt((subathonTimerStyle['font-size'] ?? '5') as string)}
          min={5}
          max={128}
          label={(value) => `${value}px`}
          onChange={(value) => setSubathonTimerStyle({ ...subathonTimerStyle, 'font-size': value })}
        />
        <Text size='sm' mt='xs'>
          Font weight
        </Text>
        <Text c='dimmed' size='xs'>
          font-weight
        </Text>
        <Slider
          value={parseInt((subathonTimerStyle['font-weight'] ?? '100') as string)}
          min={100}
          max={600}
          step={100}
          onChange={(value) => setSubathonTimerStyle({ ...subathonTimerStyle, 'font-weight': value.toString() })}
        />
        <Select
          label={
            <Text size='sm'>
              Font family{' '}
              <ActionIcon size='xs' variant='filled' aria-label='Settings' onClick={fontDialogToggle}>
                <IconFilePlus style={{ width: '80%', height: '80%' }} stroke={1.5} />
              </ActionIcon>
            </Text>
          }
          placeholder='font-family'
          onChange={(value) => setSubathonTimerStyle({ ...subathonTimerStyle, 'font-family': value ?? '' })}
          data={[
            'Arial',
            'Verdana',
            'Tahoma',
            'Trebuchet MS',
            'Times New Roman',
            'Georgia',
            'Garamond',
            'Courier New',
            'Brush Script MT',
            ...(fonts ?? []),
          ]}
          value={subathonTimerStyle['font-family'] as string}
        />
      </Fieldset>

      <Dialog
        opened={fontDialogOpen}
        withCloseButton
        onClose={fontDialogClose}
        size='lg'
        radius='md'
        bg={theme.colors.dark[6]}>
        <Text size='sm' mb='xs' fw={500}>
          Add any font from{' '}
          <Anchor href='https://fonts.google.com/' target='_blank'>
            Google Fonts{' '}
          </Anchor>
          by typing the font name below.
        </Text>
        <Group align='flex-end'>
          <TextInput
            onChange={(e) => {
              setFontInput(e.currentTarget.value);
            }}
            placeholder='Roboto'
            style={{ flex: 1 }}
          />
          <Button
            onClick={() => {
              addFont(`'${fontInput}'`);
              setFontInput('');
            }}>
            Add font
          </Button>
        </Group>
      </Dialog>
    </div>
  );
};

export default StyleControls;
