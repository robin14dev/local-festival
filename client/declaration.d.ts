declare module "*.png";
declare module "*.svg";
declare module "*.gif";
declare module "*.mp4";

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
  defaultPic: string;
  loginStatus: boolean;
};

type TReviewItem = {
  User: {
    nickname: string;
    defaultPic: string;
  };
  content: string;
  createdAt: string;
  festivalId: number;
  id: number;
  rating: number;
  updatedAt: string;
  userId: number;
  like_num: number;
};

type loginHandlerFunc = (
  userId: number,
  account: string,
  nickname: string,
  defaultPic: string,
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

type LoginModalContext = {
  isLoginModal: boolean;
  setIsLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type UserContext = {
  authState: AuthState;
  setAuthState: React.Dispatch<
    React.SetStateAction<{
      userId: number;
      account: string;
      nickname: string;
      defaultPic: string;
      loginStatus: boolean;
    }>
  >;
};

type EditItem = {
  isEdit: boolean;
  info: TReviewItem;
};

type TComment = {
  id: number;
  ref: number;
  step: number;
  ref_order: number;
  child_num: number;
  parent_id: number;
  parent_nickname: string;
  like: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: number;
  reviewId: number;
  is_edit: boolean;
  User: {
    nickname: string;
    defaultPic: string;
  };
};

type Message = {
  text: string;
  dismissTime: number;
  uuid: number;
};
