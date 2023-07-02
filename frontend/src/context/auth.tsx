import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContextProps } from '../@interfaces/authContext';
import { useLocalStorage } from './useLocalStorage';
export const Context = React.createContext<authContextProps | null>(null);

const url = 'http://kamis-1.fesb.hr:8000/api/';

const AuthContextProvider = ({ children }: any) => {
  const [token, setToken] = useLocalStorage('token', null);
  const [expiry, setExpiry] = useLocalStorage('expiry', null);
  const [error, setError] = useState({ message: '' });
  const navigate = useNavigate();

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
        setToken(data.token[0]);
        setExpiry(data.token[1]);
        setTimeout(() => {
          navigate('/');
          setError({ message: '' });
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
    setExpiry(null);
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
        setToken(data.data[0]);
        setExpiry(data.data[1]);
        setTimeout(() => {
          navigate('/');
          setError({ message: '' });
        }, 200);
      } else {
        console.log(response);
        throw new Error(response.statusText);
      }
    } catch (error: any) {
      console.log('error occured: ', error);
      setError(error);
    }
  };

  return (
    <Context.Provider
      value={{
        token,
        error,
        expiry,
        register,
        login,
        logOut,
        setError,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AuthContextProvider;

export const useAuth = () => {
  return useContext(Context);
};
