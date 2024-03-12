import { useLocation } from "react-router-dom";
import React from "react";
import { getCurrentDate } from "../../components/Festival";

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
  imageUrl:
    "https://images.unsplash.com/photo-1707343843344-011332037abb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  location: "위치 정보",
  overview: "축제 개요",
  startDate: 20240101,
  tel: "010-1234-5678",
  title: "축제 제목",
  updatedAt: "",
};

const today = getCurrentDate();

export const mockFestivalItems = {
  inProgress: { ...mockFestivalItem, startDate: today - 1, endDate: today + 1 },
  scheduled: { ...mockFestivalItem, startDate: today + 1, endDate: today + 2 },
  completed: { ...mockFestivalItem, startDate: today - 2, endDate: today - 1 },
};

export const mockReviewSummary: ReviewSummary = {
  content: "",
  festivalId: 1,
  id: 1,
  nickname: "person1",
  rating: 1,
  updatedAt: "",
};

export const mockSummary: Summary = {
  average: 0,
  badReview: [mockReviewSummary],
  festival: mockFestivalItem,
  goodReview: [mockReviewSummary],
  isPicked: true,
  likes: 0,
  reviewCount: 0,
};
