import { useLocation } from "react-router-dom";
import React from "react";

export const mockAuthState = {
  login: {
    loginStatus: true,
    userId: 1,
    account: "abc@abc.com",
    nickname: "abc",
    defaultPic: "",
  },
  logout: {
    loginStatus: false,
    userId: 0,
    account: "",
    nickname: "",
    defaultPic: "",
  },
};
export const mockSetAuthState = jest.fn();

export const intersectionObserverMock = () => ({
  observe: () => null,
  disconnect: () => null,
});

export const URLTestComponent = (): JSX.Element => {
  const { pathname } = useLocation();
  return <div>pathname is {pathname}</div>;
};
