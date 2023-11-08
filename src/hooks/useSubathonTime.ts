import { useContext } from 'react';

import { SubathonTimeCtx } from '../context/subathon-time';

const useSubathonTime = () => {
  const { subathonTime, setSubathonTime, timerActive, setTimerActive } = useContext(SubathonTimeCtx);

  return { subathonTime, setSubathonTime, timerActive, setTimerActive };
};

export default useSubathonTime;
