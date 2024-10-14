import { Accessor, createContext, JSX, useContext } from "solid-js";

export interface UserDetails {
  _id: string;
  email: string;
  display_name: string;
}

const AuthContext = createContext<Accessor<UserDetails>>();

export function AuthProvider(props: {
  children: JSX.Element;
  auth: Accessor<UserDetails>;
}) {
  return (
    <AuthContext.Provider value={props.auth}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
