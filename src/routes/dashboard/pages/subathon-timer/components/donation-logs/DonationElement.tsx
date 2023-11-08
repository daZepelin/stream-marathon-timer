import { IDonation } from '../../../../../../types/sockets';
import { Flex, Paper, useMantineTheme } from '@mantine/core';
import { formatDate, formatTime } from '../../../../../../services/utils';
import { motion } from 'framer-motion';
import classes from './DonationLogs.module.css';

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
            <Flex direction={'row'} gap='xs' align='flex-end'>
              <div className={classes.username}>{donation.username}</div>
              <div className={classes.dateAgo}>{formatDate(donation.date)}</div>
            </Flex>
            <div className={classes.dateFormated}>{donation.date.toLocaleString()}</div>
          </div>
          <Flex direction={'column'} align='flex-end'>
            <div>
              {donation.amount}
              {donation.currency ?? '€'}
            </div>
            <div>{donation.minutesAdded}min</div>
          </Flex>
        </Flex>
      </Paper>
    </motion.div>
  );
}

export default DonationElement;
