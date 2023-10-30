import { useContext } from 'react';

import { SubathonTimeCtx } from '../context/subathon-time';

const useSubathonTime = () => {

  const { subathonTime, setSubathonTime } = useContext(SubathonTimeCtx);


  return { subathonTime, setSubathonTime };
};

export default useSubathonTime;
