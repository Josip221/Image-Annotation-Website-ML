import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContextProps } from '../@interfaces/authContext';
import { useLocalStorage } from './useLocalStorage';
export const Context = React.createContext<authContextProps | null>(null);

const url = 'http://127.0.0.1:8000/api/';

const AuthContextProvider = ({ children }: any) => {
  const [token, setToken] = useLocalStorage('user', null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  //login
  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${url}login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setToken(data.token);
        setTimeout(() => {
          navigate('/home');
          setError('');
        }, 200);
      } else {
        throw new Error('Incorrect credentials');
      }
    } catch (error: any) {
      console.log('error occured: ', error);
      setError(error);
    }
  };

  const logOut = async () => {
    setToken(null);
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch(`${url}register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setToken(username);
        setTimeout(() => {
          navigate('/home');
          setError('');
        }, 200);
      } else {
        throw new Error('Incorrect credentials');
      }
    } catch (error: any) {
      console.log('error occured: ', error);
      setError(error);
    }
  };

  //register

  //logout
  //   const value = useMemo(
  //     () => ({
  //       user,
  //       login,
  //     }),
  //     [user, login]
  //   );

  return (
    <Context.Provider value={{ token, error, register, login, logOut }}>
      {children}
    </Context.Provider>
  );
};

export default AuthContextProvider;

export const useAuth = () => {
  return useContext(Context);
};
