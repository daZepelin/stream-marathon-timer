import { IDonation } from '../../../../../../types/sockets';
import { Flex, Paper, useMantineTheme } from '@mantine/core';
import { formatDate, formatTime } from '../../../../../../services/utils';
import { motion } from 'framer-motion';
import classes from './DonationLogs.module.css';
import useSubathonTimerConfig from '../../../../../../hooks/useSubathonTimerConfig';
import { useMemo } from 'react';

type Props = {
  donation: {
    message?: string;
  };
  highlightStrings: string[];
};

const HighlightMessage: React.FC<Props> = ({ donation, highlightStrings }) => {
  const theme = useMantineTheme();

  const highlightMatch = (message: string, stringsArray: string[]): JSX.Element => {
    if (!stringsArray) return <span>{message.length > 30 ? message.substring(0, 30) + '...' : message}</span>;
    let matchedString = useMemo(() => stringsArray.find((str) => message.toLowerCase().includes(str.toLowerCase())), [message, stringsArray]);

    if (matchedString) {
      let parts = message.split(new RegExp(`(${matchedString})`, 'gi'));
      return (
        <span>
          {parts.map((part, index) =>
            part.toLowerCase() === matchedString?.toLowerCase() ? (
              <span style={{ color: theme.colors.blue[4] }} key={index}>
                {part}
              </span>
            ) : (
              part
            )
          )}
        </span>
      );
    }

    return <span>{message.length > 30 ? message.substring(0, 30) + '...' : message}</span>;
  };

  return (
    <div className={classes.dateFormated}>
      {donation.message ? highlightMatch(donation.message, highlightStrings) : ''}
    </div>
  );
};

function DonationElement({ donation }: { donation: IDonation }) {
  const theme = useMantineTheme();
  const { specialMultiplier } = useSubathonTimerConfig();

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
            <HighlightMessage donation={donation} highlightStrings={specialMultiplier.word} />
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
