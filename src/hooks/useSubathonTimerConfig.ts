import { useContext } from 'react';
import { SubathonTimerConfigCtx } from '../context/subathon-time';

const useSubathonTimerConfig = () => {
  const { subathonTimerStyle, setSubathonTimerStyle, subathonTimerMultiplierData, setSubathonTimerMultiplierData } =
    useContext(SubathonTimerConfigCtx);

  return { subathonTimerStyle, setSubathonTimerStyle, subathonTimerMultiplierData, setSubathonTimerMultiplierData };
};

export default useSubathonTimerConfig;
