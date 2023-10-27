import { useState } from 'react';

const useSubathonTimerStyle = () => {
  const [style, setStyle] = useState({} as any);

  return { subathonTimerStyle: style, setSubathonTimerStyle: setStyle };
};

export default useSubathonTimerStyle;