import React, { RefObject, useContext, useEffect } from 'react';
import { SubathonTimerStyleCtx } from '../../../../../../../context/subathon-time';
import { ColorInput, Fieldset, Select, Slider, Text } from '@mantine/core';

const StyleControls = () => {
  const { subathonTimerStyle, setSubathonTimerStyle } = useContext(SubathonTimerStyleCtx);
  useEffect(() => {
    console.log(subathonTimerStyle);
  }, [subathonTimerStyle]);
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
          defaultValue={parseFloat(subathonTimerStyle['-webkit-text-stroke-width'] as string)}
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
          defaultValue={parseInt(subathonTimerStyle['font-size'] as string)}
          min={5}
          max={128}
          label={(value) => `${value}px`}
          onChange={(value) => setSubathonTimerStyle({ ...subathonTimerStyle, 'font-size': value })}
        />
        <Select
          label='Font'
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
          ]}
          defaultValue={subathonTimerStyle['font-family'] as string}
        />
      </Fieldset>
    </div>
  );
};

export default StyleControls;
