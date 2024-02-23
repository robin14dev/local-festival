import React, { useState, createContext } from "react";

export const LoginModalContext = createContext<LoginModalContext>({
  isLoginModal: false,
  setIsLoginModal: (): void => {},
});

type Props = {
  children: JSX.Element | JSX.Element[];
};
export const LoginModalContextProvider = ({ children }: Props) => {
  const [isLoginModal, setIsLoginModal] = useState(false);
  return (
    <LoginModalContext.Provider value={{ isLoginModal, setIsLoginModal }}>
      {children}
    </LoginModalContext.Provider>
  );
};
