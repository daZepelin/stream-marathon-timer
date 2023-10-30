import { formatTime } from '../../services/utils';
import useSubathonTime from '../../hooks/useSubathonTime';
import useSubathonTimerConfig from '../../hooks/useSubathonTimerConfig';

const SubathonTimerDisplay = () => {
  const { subathonTime } = useSubathonTime();
  const { subathonTimerStyle } = useSubathonTimerConfig();

  return (
    <div
      style={{
        width: '100%',
        textAlign: 'center',
        ...subathonTimerStyle,
        textShadow: ` ${subathonTimerStyle['font-border-width']}px 0 0 ${subathonTimerStyle['font-border-color']},  ${subathonTimerStyle['font-border-width']}px 0 0 ${subathonTimerStyle['font-border-color']},  ${subathonTimerStyle['font-border-width']}px 0 0 ${subathonTimerStyle['font-border-color']},  ${subathonTimerStyle['font-border-color']} ${subathonTimerStyle['font-border-color']} 0 0`,
      }}>
      {formatTime(subathonTime)}
    </div>
  );
};

export default SubathonTimerDisplay;
