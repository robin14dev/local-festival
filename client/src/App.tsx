import './App.css';
import '../src/styles/common.scss';
import theme from './styles/theme';
import React, { useState, useRef, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled, { ThemeProvider } from 'styled-components';
import axios from 'axios';
import { UserContext } from './contexts/userContext';
import { ModalContext } from './contexts/modalContext';
import Wishlist from './pages/Wishlist';
import DetailView from './pages/DetailView';
import Main from './pages/Main';
import Account from './pages/Account';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';

const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
`;

const getUserInfoFromStorage: () => AuthState = () => {
  if (sessionStorage.getItem('user')) {
    const user = sessionStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
  } else {
    return {
      userId: 0,
      account: '',
      nickname: '',
      defaultPic: '',
      loginStatus: false,
    };
  }
};
const getUserPicksFromStorage: () => FestivalItem[] = () => {
  if (sessionStorage.getItem('picks')) {
    const picks = sessionStorage.getItem('picks');
    if (picks) {
      return JSON.parse(picks);
    }
  } else {
    return [];
  }
};

function App() {
  const [authState, setAuthState] = useState(getUserInfoFromStorage());
  const [festivalData, setFestivalData] = useState<FestivalItem[]>([]);
  const [pickItems, setPickItems] = useState<FestivalItem[]>(
    getUserPicksFromStorage()
  );
  const [filteredData, setFilteredData] =
    useState<FestivalItem[]>(festivalData);
  const [openLoginModal, setLoginModal] = useState(false);
  const [openSignupModal, setSignupModal] = useState(false);
  const offset = useRef(0);

  const loginHandler: loginHandlerFunc = useCallback(
    async (userId, account, nickname, defaultPic, loginStatus) => {
      //* 로그인한 후의 유저정보 상태변경입니다.
      const nextState = {
        userId,
        account,
        nickname,
        defaultPic,
        loginStatus,
      };
      setAuthState(nextState);
      //# 유저별 찜한 축제 가져오기

      try {
        const result = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/pick`,
          {
            headers: {
              accesstoken: sessionStorage.getItem('accesstoken') ?? '',
            },
          }
        );

        setPickItems(result.data);
        sessionStorage.setItem('picks', JSON.stringify(result.data));
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  const togglePick: togglePick = useCallback(
    async (newPick) => {
      //#1. 픽했는지 아닌지 부터 확인
      const found = pickItems.filter(
        (el) => el.festivalId === newPick.festivalId
      );
      if (found.length !== 0) {
        // 이미 찜목록에 있으면 해제를 시켜줘야됨
        //픽 해제해서 서버에 픽 해제한 정보 보내주기
        try {
          await axios.delete(`${process.env.REACT_APP_SERVER_URL}/pick`, {
            data: { festivalId: newPick.festivalId },
            headers: {
              accesstoken: sessionStorage.getItem('accesstoken') ?? '',
            },
          });
          const nextPicks = pickItems.filter(
            (item) => item.festivalId !== newPick.festivalId
          );
          setPickItems(nextPicks);
          sessionStorage.setItem('picks', JSON.stringify(nextPicks));
        } catch (error) {
          console.log(error);
        }
      } else {
        //픽해서 서버에 픽한 정보 보내주기
        try {
          await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/pick`,
            {
              festivalId: newPick.festivalId,
            },
            {
              headers: {
                accesstoken: sessionStorage.getItem('accesstoken') ?? '',
              },
            }
          );
          const nextPicks = [newPick, ...pickItems];

          setPickItems(nextPicks);
          sessionStorage.setItem('picks', JSON.stringify(nextPicks));
        } catch (error) {
          console.log(error);
        }
      }
    },
    [pickItems]
  );

  const handleAuthState = (nickname: string) => {
    const nextAuthState = authState;
    nextAuthState.nickname = nickname;
    setAuthState(nextAuthState);
  };
  // const refreshData = async () => {
  //   if (sessionStorage.getItem('accesstoken')) {
  //     const authData = await axios.get(
  //       `${process.env.REACT_APP_SERVER_URL}/users`,
  //       {
  //         headers: {
  //           accesstoken: sessionStorage.getItem('accesstoken') ?? '',
  //         },
  //       }
  //     );

  //     const { userId, account, nickname, defaultPic } = authData.data.info;
  //     const user: { [index: string]: number | boolean | string } = {
  //       userId,
  //       account,
  //       nickname,
  //       defaultPic,
  //       loginStatus: true,
  //     };
  //     if (sessionStorage.getItem('user')) {
  //       const storageUser = sessionStorage.getItem('user');

  //       if (storageUser) {
  //         const parsedUser = JSON.parse(storageUser);
  //         for (const key in user) {
  //           console.log(user[key], parsedUser[key]);
  //           if (user[key] !== parsedUser[key]) {
  //             break;
  //           }
  //         }
  //         return;
  //       }
  //     }
  //     console.log('업데이트간다');

  //     setAuthState({
  //       userId,
  //       account,
  //       nickname,
  //       defaultPic,
  //       loginStatus: true,
  //     });

  //     const pickedItems = await axios.get(
  //       `${process.env.REACT_APP_SERVER_URL}/pick`,
  //       {
  //         headers: {
  //           accesstoken: sessionStorage.getItem('accesstoken') ?? '',
  //         },
  //       }
  //     );
  //     setPickItems(pickedItems.data);
  //   }
  // };

  return (
    <ThemeProvider theme={theme}>
      <ModalContext.Provider value={{ openLoginModal, setLoginModal }}>
        <UserContext.Provider value={{ authState, setAuthState }}>
          <Wrapper>
            <Helmet>
              <title>이번주엔 어디로 가볼까? - LOCO</title>
            </Helmet>
            {openLoginModal && (
              <LoginModal
                loginHandler={loginHandler}
                setLoginModal={setLoginModal}
                setSignupModal={setSignupModal}
              />
            )}
            {openSignupModal && (
              <SignupModal
                setSignupModal={setSignupModal}
                setLoginModal={setLoginModal}
              />
            )}

            <Header
              authState={authState}
              setAuthState={setAuthState}
              setLoginModal={setLoginModal}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    togglePick={togglePick}
                    filteredData={filteredData}
                    pickItems={pickItems}
                    setFestivalData={setFestivalData}
                    setFilteredData={setFilteredData}
                    offset={offset}
                  />
                }
              ></Route>
              <Route
                path=":search"
                element={
                  <Main
                    togglePick={togglePick}
                    filteredData={filteredData}
                    pickItems={pickItems}
                    setFestivalData={setFestivalData}
                    setFilteredData={setFilteredData}
                    offset={offset}
                  />
                }
              ></Route>

              <Route
                path="/Wishlist"
                element={
                  <Wishlist pickItems={pickItems} togglePick={togglePick} />
                }
              ></Route>
              <Route
                path="/Detail/:festivalId/*"
                element={
                  <DetailView togglePick={togglePick} authState={authState} />
                }
              ></Route>
              <Route
                path="/Account"
                element={
                  <Account
                    handleAuthState={handleAuthState}
                    authState={authState}
                  />
                }
              ></Route>
            </Routes>
            <Footer authState={authState} setLoginModal={setLoginModal} />
          </Wrapper>
        </UserContext.Provider>
      </ModalContext.Provider>
    </ThemeProvider>
  );
}

export default App;
