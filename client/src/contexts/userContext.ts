import { createContext } from "react";

export const UserContext = createContext<UserContext>({
  authState: {
    userId: 0,
    account: "",
    nickname: "",
    defaultPic: "",
    loginStatus: false,
  },
  setAuthState: () => undefined,
});

/**
 *
 * Context 밖으로 분리하는 거 해야됨
 */
