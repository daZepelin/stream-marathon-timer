import { formatTime } from '../../services/utils';
import useSubathonTime from '../../hooks/useSubathonTime';
import useSubathonTimerConfig from '../../hooks/useSubathonTimerConfig';
import { useEffect, useState } from 'react';
import WebFont from 'webfontloader';
import { motion, AnimatePresence } from 'framer-motion';

const SubathonTimerDisplay = () => {
  const [previousTime, setPreviousTime] = useState<number>(-1);
  const [additionDisplayed, setAdditionDisplayed] = useState<string | null>(null);
  const { subathonTime, timerActive } = useSubathonTime();
  const { subathonTimerStyle } = useSubathonTimerConfig();

  useEffect(() => {
    if (subathonTime == null) return;
    if (subathonTime - previousTime > 30) {
      setAdditionDisplayed(formatTime(subathonTime - previousTime));
      setTimeout(() => {
        setAdditionDisplayed(null);
      }, 3000);
    }
    setPreviousTime(subathonTime);
  }, [subathonTime, previousTime]);

  useEffect(() => {
    if (typeof subathonTimerStyle['font-family'] === 'string' && subathonTimerStyle['font-family'].length > 0) {
      WebFont.load({
        google: {
          families: [subathonTimerStyle['font-family'].replaceAll("'", '')],
        },
      });
    }
  }, [subathonTimerStyle['font-family']]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        width: '100%',
        textAlign: 'left',
        ...subathonTimerStyle,
        textShadow: ` ${subathonTimerStyle['font-border-width']}px 0 0 ${subathonTimerStyle['font-border-color']},  ${subathonTimerStyle['font-border-width']}px 0 0 ${subathonTimerStyle['font-border-color']},  ${subathonTimerStyle['font-border-width']}px 0 0 ${subathonTimerStyle['font-border-color']},  ${subathonTimerStyle['font-border-color']} ${subathonTimerStyle['font-border-color']} 0 0`,
      }}>
      <div>{formatTime(subathonTime)}</div>
      {timerActive}
      <AnimatePresence>
        {additionDisplayed && (
          <motion.div
            key={'time-addition' + additionDisplayed}
            initial={{ opacity: 0, y: -55, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ y: { type: 'spring', stiffness: 150 } }}
            exit={{ opacity: 0 }}>
            + {additionDisplayed}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubathonTimerDisplay;
