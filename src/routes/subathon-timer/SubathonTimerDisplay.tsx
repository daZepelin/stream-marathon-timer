import React, { useContext } from 'react';
import { formatTime } from '../../services/utils';
import { SubathonTimeCtx } from '../../context/subathon-time';

const SubathonTimerDisplay = () => {
  const { subathonTime } = useContext(SubathonTimeCtx);

  return <div>{formatTime(subathonTime)}</div>;
};

export default SubathonTimerDisplay;
