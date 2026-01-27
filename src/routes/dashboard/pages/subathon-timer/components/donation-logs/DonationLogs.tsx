import { useDonations } from '../../../../../../hooks/useDonations';
import { HEADER_HEIGHT } from '../../../../../../services/utils';
import DonationElement from './DonationElement';
import { motion, AnimatePresence } from 'framer-motion';
import { Paper, Text } from '@mantine/core';

const DonationLogs = () => {
  const { donations } = useDonations();
  return (
    <Paper
      withBorder
      shadow='sm'
      p='md'
      radius='lg'
      bg='dark.7'
      style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)`, overflowY: 'auto' }}>
      <Text fw={600} mb='xs'>
        Recent donations
      </Text>
      <Text size='xs' c='dimmed' mb='md'>
        Latest activity appears here with highlights.
      </Text>
      <motion.div
        layout
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '12px',
          justifyContent: 'flex-end',
        }}>
        {donations.map((donation) => {
          return (
            <AnimatePresence>
              <DonationElement donation={donation} key={donation.id} />
            </AnimatePresence>
          );
        })}
      </motion.div>
    </Paper>
  );
};

export default DonationLogs;
