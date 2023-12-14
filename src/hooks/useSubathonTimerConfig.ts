import { useContext } from 'react';
import { SubathonTimerConfigCtx } from '../context/subathon-time';

const useSubathonTimerConfig = () => {
  const { specialMultiplier, setSpecialMultiplier, subathonTimerStyle, setSubathonTimerStyle, subathonTimerMultiplierData, setSubathonTimerMultiplierData } =
    useContext(SubathonTimerConfigCtx);

  return { specialMultiplier, setSpecialMultiplier, subathonTimerStyle, setSubathonTimerStyle, subathonTimerMultiplierData, setSubathonTimerMultiplierData };
};

export default useSubathonTimerConfig;
