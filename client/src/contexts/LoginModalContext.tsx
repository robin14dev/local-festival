import LoginModal from "components/account/LoginModal";
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
        {isLoginModal && <LoginModal/>}
        {children}
      </LoginModalDispatchContext.Provider>
    </LoginModalStateContext.Provider>
  );
};

/**
 * ModalContext로 해서 여러개 나올 수 있게 하는 방법 
 * 
 * showModal setShowModal 해서
 * 
 * 모달 나올때 키랑 컴포넌트 맵핑해서 보여주기 
 * 
 * 배열로 넣어서 렌더링
 * 
 * 
 * 
 */
