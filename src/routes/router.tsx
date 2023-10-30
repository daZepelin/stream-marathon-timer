import { createBrowserRouter, redirect } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import { SubathonTimer } from './dashboard/pages/subathon-timer/SubathonTimer';
import SubathonTimerDisplay from './subathon-timer/SubathonTimerDisplay';
import AuthentificationPanel from './dashboard/pages/authentification/AuthentificationPanel';

export const router = createBrowserRouter([
  {
    path: '/',
    loader: () => redirect('/dashboard'),
    errorElement: <div>404</div>,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      {
        index: true,
        path: '',
        element: <SubathonTimer />,
        action: async () => {},
      },
      {
        path: 'subathon-timer',
        element: <SubathonTimer />,
        action: async () => {},
      },
      {
        path: 'authentification',
        element: <AuthentificationPanel />,
        action: async () => {},
      },
      {
        path: 'lucky-wheel',
        element: <div>lucky-wheel</div>,
      },
    ],
  },
  {
    path: '/subathon-timer',
    element: <SubathonTimerDisplay />,
  },
]);
