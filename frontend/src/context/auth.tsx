import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContextProps } from '../@interfaces/authContext';
import { useLocalStorage } from './useLocalStorage';
export const Context = React.createContext<authContextProps | null>(null);

const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useLocalStorage('user', null);
  const navigate = useNavigate();

  //login
  const login = async (name: string) => {
    setUser(name);
    navigate('/home');
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
