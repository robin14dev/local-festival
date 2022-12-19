declare module '*.png';
declare module '*.svg';
declare module '*.gif';
declare module '*.mp4';

type onSearchFunc = (searchText: string) => void;

type FestivalItem = {
  createdAt: string;
  deletedAt: null | string;
  endDate: number;
  festivalId: number;
  homepageUrl: string;
  imageUrl: string;
  location: string;
  overview: string;
  startDate: number;
  tel: string;
  title: string;
  updatedAt: string;
};

type togglePick = (newPick: FestivalItem) => void;

type AuthState = {
  userId: number;
  account: string;
  nickname: string;
  loginStatus: boolean;
};

type TReviewItem = {
  User: {
    nickname: string;
  };
  content: string;
  createdAt: string;
  festivalId: number;
  id: number;
  rating: number;
  updatedAt: string;
  userId: number;
};

type loginHandlerFunc = (
  userId: number,
  account: string,
  nickname: string,
  loginStatus: boolean
) => void;

type ReviewSummary = {
  content: string;
  festivalId: number;
  id: number;
  nickname: string;
  rating: number;
  updatedAt: string;
};

type Summary = {
  average: number;
  badReview: [ReviewSummary];
  festival: FestivalItem;
  goodReview: [ReviewSummary];
  isPicked: boolean;
  likes: number;
  reviewCount: number;
};

type ModalContext = {
  openLoginModal: boolean;
  setLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type UserContext = {
  authState: AuthState;
  setAuthState: React.Dispatch<
    React.SetStateAction<{
      userId: number;
      account: string;
      nickname: string;
      loginStatus: boolean;
    }>
  >;
};
