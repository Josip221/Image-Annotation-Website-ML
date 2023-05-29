export interface authContextProps {
  token: string;
  error: string;
  register: any;
  login: (username: string, password: string) => Promise<void>;
  logOut: any;
}
