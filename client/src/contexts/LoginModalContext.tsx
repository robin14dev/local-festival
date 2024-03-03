import React, { useState, createContext } from "react";

type State = boolean;
type Dispatch = React.Dispatch<React.SetStateAction<State>>;

export const LoginModalStateContext = createContext<State>(false);

export const LoginModalDispatchContext = createContext<Dispatch>(() => {});

type Props = {
  children: JSX.Element | JSX.Element[];
};
export const LoginModalContextProvider = ({ children }: Props) => {
  const [isLoginModal, setIsLoginModal] = useState(false);
  return (
    <LoginModalStateContext.Provider value={isLoginModal}>
      <LoginModalDispatchContext.Provider value={setIsLoginModal}>
        {children}
      </LoginModalDispatchContext.Provider>
    </LoginModalStateContext.Provider>
  );
};
