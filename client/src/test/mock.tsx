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

export const mockFestivalItem: FestivalItem = {
  createdAt: "",
  deletedAt: "",
  endDate: 20241231,
  festivalId: 1,
  homepageUrl: "https://www.locoloco.pl",
  imageUrl: "",
  location: "위치 정보",
  overview: "축제 개요",
  startDate: 20240101,
  tel: "010-1234-5678",
  title: "축제 제목",
  updatedAt: "",
};
