import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Mainpage from "./pages/Mainpage";
import MyPick from "../src/pages/MyPick";
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
  display: flex;
  flex-direction: column;
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
  const [festivalData, setFestivalData] = useState(null);
  const [pickItems, setPickItems] = useState([]);
  const [filteredData, setFilteredData] = useState(festivalData);

  // const infiniteScroll = (addData) => {
  //   //console.log('addData', addData);
  //   // console.log('here');
  //   console.log(festivalData, addData);
  //   let addToData = festivalData.concat(addData)
  //   console.log('new state',addToData);
  //   //alert('here')
  //   setFestivalData(addToData)
  //   setFilteredData(addToData)
  // }
 
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
    const found = pickItems.filter((el) => el.festivalId === newPick.festivalId);
    console.log('wht is found', found);
    if (found.length !== 0) { // 이미 찜목록에 있으면 해제를 시켜줘야됨
      console.log("found");

    //#2-1. 픽 해제해서 서버에 픽 해제한 정보 보내주기
      console.log("removeId what!!!", newPick);

      //*서버에 삭제요청 보내기
      axios.delete(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/pick`,  {data : {festivalId: newPick.festivalId}, headers: {
        accesstoken: sessionStorage.getItem("accesstoken"),
      }})
      .then(response => {
        console.log(response.data.message);
      })
      .catch(err => {
        console.log(err);
      })

        setPickItems(pickItems.filter((el) => el.festivalId !== newPick.festivalId));
    } else {
      console.log("add new");
     //#2-2. 픽해서 서버에 픽한 정보 보내주기
      axios
        .post(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/pick`, {
          festivalId: newPick.festivalId,
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
        newPick
      ]);
    }
  };
 
  const handleAuthState = (nickname)=>{
    const nextAuthState = authState
    nextAuthState.nickname = nickname
    setAuthState(nextAuthState)
   
  }

  
 

  useEffect(() => {
   
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/festivals`,
          {params: {limit: 10}}, 
         
        );
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
        const pickedFestival = response.data;
        //console.log(pickedFestivalId);
        // const festivalIdArr = pickedFestivalId.map(ele => ele.local_id)
        // const pickedFestivalByUser = festivalData.filter(ele => festivalIdArr.indexOf(ele.id) > -1)
        //{festivalId: 4}
        setPickItems(pickedFestival);
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
              // infiniteScroll={infiniteScroll}
            />
          }
        ></Route>
        <Route
          exact
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
