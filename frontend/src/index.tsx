import React from 'react';
import ReactDOM from 'react-dom/client';

//pages
import HomePage from './pages/HomePage';
import ErrorPage from './pages/ErrorPage';
import DashboardPage from './pages/DashboardPage';

import Navbar from './components/Navbar';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GlobalStyle from './globalStyles.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/home',
        element: <HomePage />,
      },
      {
        path: '/Dashboard',
        element: <DashboardPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <RouterProvider router={router} />
  </React.StrictMode>
);
