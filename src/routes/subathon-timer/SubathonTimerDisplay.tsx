import React, { useContext } from 'react';
import { formatTime } from '../../services/utils';
import { SubathonTimeCtx, SubathonTimerConfigCtx } from '../../context/subathon-time';

const SubathonTimerDisplay = () => {
  const { subathonTime } = useContext(SubathonTimeCtx);
  const { subathonTimerStyle } = useContext(SubathonTimerConfigCtx);

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
