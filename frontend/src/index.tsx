import React from 'react';
import ReactDOM from 'react-dom/client';

import ErrorPage from './pages/ErrorPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GlobalStyle from './globalStyles.js';
import { theme } from './globalStyles.js';
import { ThemeProvider } from 'styled-components';
import ContextProvider from './context/context';

import ProtectedRoute from './components/ProtectedRoute';
import AuthContextProvider from './context/auth';
import UserPage from './pages/UserPage';
import SequenceItem from './pages/SequenceItem';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthContextProvider>
        <Navbar />
      </AuthContextProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/user/:username',
        element: (
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/sequence/:id',
        element: (
          <ProtectedRoute>
            <SequenceItem />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ThemeProvider theme={theme}>
    <ContextProvider>
      <GlobalStyle />
      <RouterProvider router={router} />
    </ContextProvider>
  </ThemeProvider>
);
