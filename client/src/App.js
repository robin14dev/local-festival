import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Mainpage from "./pages/Mainpage";
import Mypage from "../src/pages/Mypage";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Detailviewpage from "./pages/Detailviewpage";
import styled from "styled-components";
import axios from "axios";
import Signup from "./components/Signup";
import AccountSetting from "./pages/AccountSetting";
const Wrapper = styled.div`
  width: 100%; //1425px 스크롤바 생김
  box-sizing: border-box;
  /* width: 100vw; */
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  margin: 0 ;
  padding: 0;
`;

function App() {
  const [authState, setAuthState] = useState({
    userId: "",
    account:"",
    nickname: "",
    loginStatus: false,
  });
  // const [isLogin, setIsLogin] = useState(false);
  const [festivalData, setFestivalData] = useState(null);
  const [pickItems, setPickItems] = useState([]);
  const [filteredData, setFilteredData] = useState(festivalData);

  const infiniteScroll = (addData) => {
    //console.log('addData', addData);
    console.log('here');
    console.log(festivalData, addData);
    let addToData = festivalData.concat(addData)
    console.log('new state',addToData);
    //alert('here')
    setFestivalData(addToData)
    setFilteredData(addToData)
  }
 
  const loginHandler = ( userId,account,nickname, loginStatus) => {
    // isLogin ? setIsLogin(false) : setIsLogin(true);
    // console.log(nickname, userId, loginStatus);
    //* 로그인한 후의 유저정보 상태변경입니다.
    const nextState = {
      userId: userId,
      account: account,
      nickname: nickname,
      loginStatus: loginStatus,
    };
    setAuthState(nextState);
    //console.log("나 실행???");

    //# 유저별 찜한 축제 가져오기
    axios.get(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/pick`
    ,{headers: {
      accesstoken: sessionStorage.getItem("accesstoken"),
    }}
    ).then((response) => { 
      const pickedFestivalId = response.data;
      //console.log(pickedFestivalId);
      // const festivalIdArr = pickedFestivalId.map(ele => ele.local_id)
      // const pickedFestivalByUser = festivalData.filter(ele => festivalIdArr.indexOf(ele.id) > -1)
      //{festivalId: 4} 
      setPickItems(pickedFestivalId);
    });
  };
  const onSearch = (searchText) => {
    console.log(searchText);
    // setCondition(searchText);
    const filteredFestival = festivalData.filter(
      (festival) =>
        festival.location.includes(searchText) ||
        festival.title.includes(searchText) ||
        festival.location.includes(searchText) ||
        (Number(festival.start_date) <= Number(searchText) &&
          Number(festival.end_date) >= Number(searchText))
    );

    setFilteredData(filteredFestival);
    //alert(`${filteredFestival.length}개의 축제가 진행중입니다.`)
    // }
  };

  const resetCondition = () => {
    setFilteredData(festivalData);
  };

  const togglePick = (id) => {
    //#1. 픽했는지 아닌지 부터 확인
    const found = pickItems.filter((el) => el.festivalId === id)[0];
    if (found) {
      console.log("found");

    //#2-1. 픽 해제해서 서버에 픽 해제한 정보 보내주기
      console.log("removeId what!!!", id);

      //*서버에 삭제요청 보내기
      axios.delete(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/pick`,  {data : {festivalId: id}, headers: {
        accesstoken: sessionStorage.getItem("accesstoken"),
      }})
      .then(response => {
        console.log(response.data.message);
      })
      .catch(err => {
        console.log(err);
      })

        setPickItems(pickItems.filter((el) => el.festivalId !== id));
    } else {
      console.log("add new");
     //#2-2. 픽해서 서버에 픽한 정보 보내주기
      axios
        .post(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/pick`, {
          festivalId: id,
        }, {headers: {
          accesstoken: sessionStorage.getItem("accesstoken"),
        }})
        .then((response) => {
          console.log(response.data.message);
        })
        .catch((err) => {
          console.log(err);
        });

      setPickItems([
        ...pickItems,
        {
          festivalId: id,
        },
      ]);
    }
  };
 
  const handleAuthState = (nickname)=>{
    const nextAuthState = authState
    nextAuthState.nickname = nickname
    setAuthState(nextAuthState)
   
  }
 

  useEffect(() => {
    // console.log("계속 작동하니???");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/festivals`,
          {params: {limit: 10}}, 
         
        );
        //console.log("서버에서 데이터 어케 받아져오지?", response);

          console.log("client", response);

        if (response) {
          setFestivalData(response.data);
          setFilteredData(response.data);
        } else {
          console.log("no fetch data & use dummyData");
          setFestivalData([]);
        }
        // setFestivalData(dummyData);
      } catch (error) {
        console.log(error);
        console.log(
          "error났을때 client에 저장해놓은 dummydata(20개짜리)로 렌더링합니다"
        );
        setFestivalData([]);
      }
    };
    fetchData();
    
    if(sessionStorage.getItem("accesstoken")){
      axios.get(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/users`, {
        headers: {
          accesstoken: sessionStorage.getItem("accesstoken"),
        },
      })
      .then(response => {
        //console.log(response.data);
        const {userId,account, nickname} = response.data.data
       
        setAuthState({
          userId :userId,
          account:account,
          nickname : nickname,
          loginStatus : true
  
        })
  
        //* 새로고침시 유저가 픽한 상태도 유지되야 하므로
        axios.get(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/pick`, {headers: {
        accesstoken: sessionStorage.getItem("accesstoken"),
      }}
      ).then((response) => {
        //console.log(response.data.data);
        const pickedFestivalId = response.data;
        //console.log(pickedFestivalId);
        // const festivalIdArr = pickedFestivalId.map(ele => ele.local_id)
        // const pickedFestivalByUser = festivalData.filter(ele => festivalIdArr.indexOf(ele.id) > -1)
        //{festivalId: 4}
        setPickItems(pickedFestivalId);
      });
    
        
      })
      .catch(err => {
        console.log(err);
        console.log('에러 발생');
      })
    }


    
  }, []);

  
  return (
    <Wrapper>
      <Header loginHandler={loginHandler} authState={authState} />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Mainpage
              authState={authState}
              togglePick={togglePick}
              onSearch={onSearch}
              filteredData={filteredData}
              pickItems={pickItems}
              resetCondition={resetCondition}
              infiniteScroll={infiniteScroll}
            />
          }
        ></Route>
        <Route
          exact
          path="/Mypage"
          element={
            <Mypage
              authState={authState}
              handleAuthState={handleAuthState}
              festivalData={festivalData}
              pickItems={pickItems}
              togglePick={togglePick}
            />
          }
        ></Route>
        <Route
          exact
          path="/Detailviewpage/festivalId/:id"
          element={<Detailviewpage  
            pickItems={pickItems} 
            togglePick={togglePick} 
            authState={authState}
            />}
        ></Route>
        <Route
        exact
        path="/AccountSetting"
        element = {
          <AccountSetting handleAuthState={handleAuthState} authState={authState}/>
        }
        >
          
        </Route>
        <Route exact path="/Signup" element={<Signup />}></Route>
      </Routes>
      <Footer />
    </Wrapper>
  );
}

export default App;
