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
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.35)',
        padding: '16px 22px',
        borderRadius: 18,
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(8px)',
        ...subathonTimerStyle,
        color: (subathonTimerStyle['-webkit-text-fill-color'] as string) || undefined,
        WebkitTextFillColor: (subathonTimerStyle['-webkit-text-fill-color'] as string) || undefined,
        WebkitTextStrokeColor: (subathonTimerStyle['-webkit-text-stroke-color'] as string) || undefined,
        WebkitTextStrokeWidth: subathonTimerStyle['-webkit-text-stroke-width']
          ? `${subathonTimerStyle['-webkit-text-stroke-width']}px`
          : undefined,
        textShadow: ` ${subathonTimerStyle['-webkit-text-stroke-width'] ?? 0}px 0 0 ${
          subathonTimerStyle['-webkit-text-stroke-color'] ?? 'transparent'
        },  ${subathonTimerStyle['-webkit-text-stroke-width'] ?? 0}px 0 0 ${
          subathonTimerStyle['-webkit-text-stroke-color'] ?? 'transparent'
        },  ${subathonTimerStyle['-webkit-text-stroke-width'] ?? 0}px 0 0 ${
          subathonTimerStyle['-webkit-text-stroke-color'] ?? 'transparent'
        },  ${subathonTimerStyle['-webkit-text-stroke-color'] ?? 'transparent'} ${
          subathonTimerStyle['-webkit-text-stroke-color'] ?? 'transparent'
        } 0 0`,
      }}>
      <div
        style={{
          paddingRight: '12px',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        }}>
        {formatTime(subathonTime)}
      </div>
      <span
        style={{
          fontSize: '0.35em',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          opacity: 0.6,
        }}>
        {timerActive ? 'Live' : 'Paused'}
      </span>
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
