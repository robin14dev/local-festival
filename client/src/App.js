import './App.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Header from './components/Header';
import Mainpage from './pages/Mainpage';
import MyPick from '../src/pages/MyPick';
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
  height: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
`;

function App() {
  const [authState, setAuthState] = useState({
    userId: '',
    account: '',
    nickname: '',
    loginStatus: false,
  });
  const [festivalData, setFestivalData] = useState([]);
  const [pickItems, setPickItems] = useState([]);
  const [filteredData, setFilteredData] = useState(festivalData);
  const [openLoginModal, setLoginModal] = useState(false);
  const [openSignupModal, setSignupModal] = useState(false);

  const loginHandler = async (userId, account, nickname, loginStatus) => {
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
        accesstoken: sessionStorage.getItem('accesstoken'),
      },
    });

    setPickItems(result.data);
  };

  const resetCondition = () => {
    setFilteredData(festivalData);
  };

  const togglePick = (newPick) => {
    //#1. 픽했는지 아닌지 부터 확인
    console.log('festival', newPick);
    const found = pickItems.filter(
      (el) => el.festivalId === newPick.festivalId
    );
    console.log('wht is found', found);
    if (found.length !== 0) {
      // 이미 찜목록에 있으면 해제를 시켜줘야됨
      console.log('found');

      //#2-1. 픽 해제해서 서버에 픽 해제한 정보 보내주기
      console.log('removeId what!!!', newPick);

      //*서버에 삭제요청 보내기
      axios
        .delete(`${process.env.REACT_APP_SERVER_URL}/pick`, {
          data: { festivalId: newPick.festivalId },
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken'),
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
      console.log('add new');
      //#2-2. 픽해서 서버에 픽한 정보 보내주기
      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/pick`,
          {
            festivalId: newPick.festivalId,
          },
          {
            headers: {
              accesstoken: sessionStorage.getItem('accesstoken'),
            },
          }
        )
        .then((response) => {
          console.log(response.data.message);
        })
        .catch((err) => {
          console.log(err);
        });

      setPickItems((prevPick) => [newPick, ...prevPick]);
    }
  };

  const handleAuthState = (nickname) => {
    const nextAuthState = authState;
    nextAuthState.nickname = nickname;
    setAuthState(nextAuthState);
  };

  useEffect(() => {
    const refreshData = async () => {
      if (sessionStorage.getItem('accesstoken')) {
        const authData = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/users`,
          {
            headers: {
              accesstoken: sessionStorage.getItem('accesstoken'),
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
              accesstoken: sessionStorage.getItem('accesstoken'),
            },
          }
        );

        setPickItems(pickedItems.data);

        //* 새로고침시 유저가 픽한 상태도 유지되야 하므로
      }
    };
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
            {/* {openWithdrawModal && (
                <Withdraw setWithdrawModal={setWithdrawModal} />
              )} */}
            <Header
              loginHandler={loginHandler}
              authState={authState}
              setLoginModal={setLoginModal}
              setSignupModal={setSignupModal}
              togglePick={togglePick}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Mainpage
                    togglePick={togglePick}
                    filteredData={filteredData}
                    pickItems={pickItems}
                    setPickItems={setPickItems}
                    resetCondition={resetCondition}
                    authState={authState}
                    setAuthState={setAuthState}
                    setFestivalData={setFestivalData}
                    setFilteredData={setFilteredData}
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
                    setPickItems={setPickItems}
                    resetCondition={resetCondition}
                    authState={authState}
                    setAuthState={setAuthState}
                    setFestivalData={setFestivalData}
                    setFilteredData={setFilteredData}
                  />
                }
              ></Route>

              <Route
                path="/MyPick"
                element={
                  <MyPick
                    authState={authState}
                    handleAuthState={handleAuthState}
                    festivalData={festivalData}
                    pickItems={pickItems}
                    togglePick={togglePick}
                  />
                }
              ></Route>
              <Route
                path="/Detail/:festivalId/*"
                element={
                  <Detailviewpage
                    pickItems={pickItems}
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
                    // setWithdrawModal={setWithdrawModal}
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
