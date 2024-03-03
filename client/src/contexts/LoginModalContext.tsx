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

/**
 *
 * TODO : isLoginModal 상태애 따라 모달이 렌더링
 * isLoginModal 상태에 따라서 하위 컴포넌트 리렌더링
 */
