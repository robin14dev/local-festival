import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Mainpage from './pages/Mainpage';
import MyPick from '../src/pages/MyPick';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Detailviewpage from './pages/Detailviewpage';
import styled from 'styled-components';
import axios from 'axios';
import SignupModal from './components/SignupModal';
import AccountSetting from './pages/AccountSetting';
import { UserContext } from './contexts/userContext';
import { ModalContext } from './contexts/modalContext';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import '../src/styles/common.scss';
import LoginModal from './components/LoginModal';
import Withdraw from './components/Withdraw';
import { Helmet } from 'react-helmet';
import { useRef } from 'react';
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
  // const [openWithdrawModal, setWithdrawModal] = useState(false);

  const loginHandler = (userId, account, nickname, loginStatus) => {
    //* 로그인한 후의 유저정보 상태변경입니다.
    const nextState = {
      userId: userId,
      account: account,
      nickname: nickname,
      loginStatus: loginStatus,
    };
    setAuthState(nextState);
    //# 유저별 찜한 축제 가져오기
    axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/pick`, {
        headers: {
          accesstoken: sessionStorage.getItem('accesstoken'),
        },
      })
      .then((response) => {
        const pickedFestivalId = response.data;
        setPickItems(pickedFestivalId);
      });
  };
  const onSearch = (searchText) => {
    //에러 : 경상도라고 치면 안나옴 => 경상남도, 경상북도 다 나오게
    // 6월
    // 서울시,인천시,부산시,광주시,대전시,울산시,대구시 => '시' 빼기
    // 경상도, 전라도, 충청도 => '도' 빼기
    // * 추후 수정 : 무한스크롤 구현 이후, 렌더링 되기전의 축제들을 검색했을때도 나와야 하므로 이때는 db에서 조회해야됨.
    // * 스크롤 하면서 넘어온 정보들 안에 원하는 검색결과가 있으면 클라이언트에서 보내주고, 없으면 db에 요청

    console.log(searchText);
    // setCondition(searchText);
    const filteredFestival = festivalData.filter(
      (festival) =>
        festival.location.includes(searchText) ||
        festival.title.includes(searchText) ||
        festival.location.includes(searchText)
    );

    setFilteredData(filteredFestival);
    //alert(`${filteredFestival.length}개의 축제가 진행중입니다.`)
    // }
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
        .delete(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/pick`, {
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
          `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/pick`,
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

      setPickItems([...pickItems, newPick]);
    }
  };

  const handleAuthState = (nickname) => {
    const nextAuthState = authState;
    nextAuthState.nickname = nickname;
    setAuthState(nextAuthState);
  };

  useEffect(() => {
    console.log('hi');
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get(
    //       `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/festivals`,
    //       { params: { limit: 10, offset: 0 } }
    //     );
    //     const festivals = response.data;
    //     setFestivalData(festivals);
    //     setFilteredData(festivals);
    //     if (sessionStorage.getItem('accesstoken')) {
    //       const authData = await axios.get(
    //         `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/users`,
    //         {
    //           headers: {
    //             accesstoken: sessionStorage.getItem('accesstoken'),
    //           },
    //         }
    //       );
    //       const { userId, account, nickname } = authData.data.data;
    //       setAuthState({
    //         userId: userId,
    //         account: account,
    //         nickname: nickname,
    //         loginStatus: true,
    //       });
    //       const pickedItems = await axios.get(
    //         `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/pick`,
    //         {
    //           headers: {
    //             accesstoken: sessionStorage.getItem('accesstoken'),
    //           },
    //         }
    //       );
    //       setPickItems(pickedItems.data);
    //       //* 새로고침시 유저가 픽한 상태도 유지되야 하므로
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     setFestivalData([]);
    //   }
    // };
    // fetchData();
    const refreshData = async () => {
      if (sessionStorage.getItem('accesstoken')) {
        const authData = await axios.get(
          `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/users`,
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
          `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/pick`,
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
                    onSearch={onSearch}
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
