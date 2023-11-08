import { useEffect, useState } from 'react';
import SegmentSwitch from './SegmentSwitch';
import StyleControls from './StyleControls';
import StyleCode from './StyleCode';
import { useElementSize } from '@mantine/hooks';
import { Flex } from '@mantine/core';

const Style = () => {
  const [segment, setSegment] = useState<'controls' | 'code'>('controls');
  const { ref, height } = useElementSize();

  useEffect(() => {
    console.log('styleControlsHeight', height);
  }, [height])
  
  return (
    <div>
      <Flex py='xs' direction={'column'} gap='md' justify={'flex-start'}>
        <SegmentSwitch segment={segment} setSegment={setSegment} />
        <div ref={ref}>
          {segment === 'code' && <StyleCode height={height} />}
          {segment === 'controls' && <StyleControls  />}
        </div>
      </Flex>
    </div>
  );
};

export default Style;
