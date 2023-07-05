export interface authContextProps {
  token: string;
  expiry: string;
  error: { message: string };
  register: any;
  login: (username: string, password: string) => Promise<void>;
  logOut: any;
  setError: React.Dispatch<
    React.SetStateAction<{
      message: string;
    }>
  >;
  user: { user_id: number; username: string };
}
