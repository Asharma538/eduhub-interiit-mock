import { createContext, JSX, useContext } from "solid-js";

export interface UserDetails {
  _id: string;
  email: string;
  display_name: string;
}

const AuthContext = createContext<UserDetails>({
  _id: "",
  email: "",
  display_name: "",
});

export function AuthProvider(props: {
  children: JSX.Element;
  auth: UserDetails;
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
