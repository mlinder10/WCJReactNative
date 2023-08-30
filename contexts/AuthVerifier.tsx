import React, { ReactNode, createContext } from "react";
import { AuthContextType, RoutesType } from "../types";
import { DEFAULT_AUTH_CONTEXT } from "../constants";
import useAuth from "../hooks/useAuth";

export const AuthContext = createContext<AuthContextType>(DEFAULT_AUTH_CONTEXT);

type AuthVerifierProps = {
  children: ReactNode;
  mounted: boolean;
};

export default function AuthVerifier({ children, mounted }: AuthVerifierProps) {
  const { user, login, logout, signup, updateUser } = useAuth();

  return (
    <AuthContext.Provider
      value={{ user, login, logout, signup, updateUser, mounted }}
    >
      {children}
    </AuthContext.Provider>
  );
}
