import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Header from './components/Header';
import Mainpage from './pages/Mainpage';
import MyPick from './pages/MyPick';
import Footer from './components/Footer';
import Detailviewpage from './pages/Detailviewpage';
import SignupModal from './components/SignupModal';
import AccountSetting from './pages/AccountSetting';
import { UserContext } from './contexts/userContext';
import { ModalContext } from './contexts/modalContext';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import '../src/styles/common.scss';
import LoginModal from './components/LoginModal';
const Wrapper = styled.div`
  width: 100%; //1425px 스크롤바 생김
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
`;

function App() {
  const [authState, setAuthState] = useState({
    userId: 0,
    account: '',
    nickname: '',
    loginStatus: false,
  });
  const [festivalData, setFestivalData] = useState<FestivalItem[]>([]);
  const [pickItems, setPickItems] = useState<FestivalItem[]>([]);
  const [filteredData, setFilteredData] =
    useState<FestivalItem[]>(festivalData);
  const [openLoginModal, setLoginModal] = useState(false);
  const [openSignupModal, setSignupModal] = useState(false);
  const offset = useRef(0);

  const loginHandler: loginHandlerFunc = async (
    userId,
    account,
    nickname,
    loginStatus
  ) => {
    console.log(userId, account, nickname, loginStatus);
    //* 로그인한 후의 유저정보 상태변경입니다.
    const nextState = {
      userId: userId,
      account: account,
      nickname: nickname,
      loginStatus: loginStatus,
    };
    setAuthState(nextState);
    //# 유저별 찜한 축제 가져오기
    let result = await axios.get(`${process.env.REACT_APP_SERVER_URL}/pick`, {
      headers: {
        accesstoken: sessionStorage.getItem('accesstoken') ?? '',
      },
    });

    setPickItems(result.data);
  };

  const togglePick: togglePick = (newPick) => {
    //#1. 픽했는지 아닌지 부터 확인
    const found = pickItems.filter(
      (el) => el.festivalId === newPick.festivalId
    );
    if (found.length !== 0) {
      // 이미 찜목록에 있으면 해제를 시켜줘야됨

      //#2-1. 픽 해제해서 서버에 픽 해제한 정보 보내주기
      console.log('removeId what!!!', newPick);

      //*서버에 삭제요청 보내기
      axios
        .delete(`${process.env.REACT_APP_SERVER_URL}/pick`, {
          data: { festivalId: newPick.festivalId },
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken') ?? '',
          },
        })
        .then((response) => {
          console.log(response.data.message);
        })
        .catch((err) => {
          console.log(err);
        });

      setPickItems(
        pickItems.filter((el) => el.festivalId !== newPick.festivalId)
      );
    } else {
      //#2-2. 픽해서 서버에 픽한 정보 보내주기
      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/pick`,
          {
            festivalId: newPick.festivalId,
          },
          {
            headers: {
              accesstoken: sessionStorage.getItem('accesstoken') ?? '',
            },
          }
        )
        .then((response) => {})
        .catch((err) => {
          console.log(err);
        });

      setPickItems((prevPick) => [newPick, ...prevPick]);
    }
  };

  const handleAuthState = (nickname: string) => {
    const nextAuthState = authState;
    nextAuthState.nickname = nickname;
    setAuthState(nextAuthState);
  };
  const refreshData = async () => {
    if (sessionStorage.getItem('accesstoken')) {
      const authData = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/users`,
        {
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken') ?? '',
          },
        }
      );

      const { userId, account, nickname } = authData.data.data;

      setAuthState({
        userId: userId,
        account: account,
        nickname: nickname,
        loginStatus: true,
      });

      const pickedItems = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/pick`,
        {
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken') ?? '',
          },
        }
      );

      setPickItems(pickedItems.data);
    }
    // console.log(sessionStorage, 'App!!');
  };
  useEffect(() => {
    refreshData();
  }, []);

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
              loginHandler={loginHandler}
              authState={authState}
              setLoginModal={setLoginModal}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Mainpage
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
                  <Mainpage
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
                path="/MyPick"
                element={
                  <MyPick pickItems={pickItems} togglePick={togglePick} />
                }
              ></Route>
              <Route
                path="/Detail/:festivalId/*"
                element={
                  <Detailviewpage
                    togglePick={togglePick}
                    authState={authState}
                  />
                }
              ></Route>
              <Route
                path="/AccountSetting"
                element={
                  <AccountSetting
                    loginHandler={loginHandler}
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
