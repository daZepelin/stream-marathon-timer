import React, { useEffect } from 'react';
import { IDonation } from '../../../../../../types/sockets';
import { Flex, Paper, useMantineTheme } from '@mantine/core';
import { formatDate, formatTime } from '../../../../../../services/utils';
import { motion } from 'framer-motion';
import classes from './DonationLogs.module.css';
import useSubathonTimerConfig from '../../../../../../hooks/useSubathonTimerConfig';

function DonationElement({ donation }: { donation: IDonation }) {
  const theme = useMantineTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 15 }}
      transition={{ y: { type: 'spring', stiffness: 300 } }}
      exit={{ opacity: 0 }}>
      <Paper withBorder p='sm' bg={theme.colors.dark[6]} radius='md'>
        <Flex direction={'row'} justify={'space-between'}>
          <div>
            <div className={classes.dateAgo}>{formatDate(donation.date)}</div>
            <div className={classes.dateFormated}>{donation.date.toLocaleString()}</div>
          </div>
          <div>
            <div>
              {donation.amount}
              {donation.currency}
            </div>
            <div>{donation.minutesAdded}min</div>
          </div>
        </Flex>
      </Paper>
    </motion.div>
  );
}

export default DonationElement;
