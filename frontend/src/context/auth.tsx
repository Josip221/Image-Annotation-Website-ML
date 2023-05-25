import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContextProps } from '../@interfaces/authContext';
import { useLocalStorage } from './useLocalStorage';
export const Context = React.createContext<authContextProps | null>(null);

const url = 'http://127.0.0.1:8000/api';

const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useLocalStorage('user', null);
  const navigate = useNavigate();

  //login
  const login = async (name: string) => {
    const username = 'dina';
    const email = 'dina@gmail.com';
    const password = '123';
    try {
      const response = fetch(`${url}/login/`, {
        method: 'POST',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      console.log(await response);
      setUser(name);
      navigate('/home');
    } catch (error) {
      console.log(error);
    }
  };

  const logOut = async () => {
    setUser(null);
  };

  const register = async (name: string) => {
    setUser();
    navigate('/home');
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
    <Context.Provider value={{ user, login, logOut }}>
      {children}
    </Context.Provider>
  );
};

export default AuthContextProvider;

export const useAuth = () => {
  return useContext(Context);
};
