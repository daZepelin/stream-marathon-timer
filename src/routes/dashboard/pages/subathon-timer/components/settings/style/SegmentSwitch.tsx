import { SegmentedControl, Center, rem, Box } from '@mantine/core';
import { IconAdjustmentsAlt, IconCode } from '@tabler/icons-react';
import React, { Dispatch, SetStateAction } from 'react';

const SegmentSwitch = ({
  segment,
  setSegment,
}: {
  segment: string;
  setSegment: Dispatch<SetStateAction<'controls' | 'code'>>;
}) => {
  return (
    <SegmentedControl
      value={segment}
      onChange={(value) => setSegment(value as 'controls' | 'code')}
      data={[
        {
          value: 'controls',
          label: (
            <Center>
              <IconAdjustmentsAlt style={{ width: rem(16), height: rem(16) }} />
              <Box ml={10}>Controls</Box>
            </Center>
          ),
        },
        {
          value: 'code',
          label: (
            <Center>
              <IconCode style={{ width: rem(16), height: rem(16) }} />
              <Box ml={10}>Code</Box>
            </Center>
          ),
        },
      ]}
    />
  );
};

export default SegmentSwitch;
