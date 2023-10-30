import { RouterProvider } from 'react-router-dom';
import { router } from '../routes/router';
import { useEffect } from 'react';
import { useDonations } from '../hooks/useDonations';

const App = () => {
  const { streamLabsSocket } = useDonations();
  const handleMessage = (event: MessageEvent) => {
    console.log(event);
  };

  useEffect(() => {
    console.log('effect, streamLabsSocket', streamLabsSocket);
    if (!streamLabsSocket) return;
    streamLabsSocket.on('event', handleMessage);
    return () => {
      streamLabsSocket.off('event', handleMessage);
    };
  }, [streamLabsSocket]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
