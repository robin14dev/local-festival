import React, { createContext, useState } from "react";

const UserContext = createContext<UserContext>({
  authState: {
    userId: 0,
    account: "",
    nickname: "",
    defaultPic: "",
    loginStatus: false,
  },
  setAuthState: (): void => {},
});

type Props = {
  children: JSX.Element | JSX.Element[];
};

const getUserInfoFromStorage: () => AuthState = () => {
  if (sessionStorage.getItem("user")) {
    const user = sessionStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
  } else {
    return {
      userId: 0,
      account: "",
      nickname: "",
      defaultPic: "",
      loginStatus: false,
    };
  }
};

const UserContextProvider = ({ children }: Props) => {
  const [authState, setAuthState] = useState(getUserInfoFromStorage());

  return (
    <UserContext.Provider value={{ authState, setAuthState }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
