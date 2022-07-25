import React, {useState, useEffect} from "react";
import Picklist from "../components/Picklist";
import styled from "styled-components";
import axios from "axios";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 81rem;
  height: 60rem;
  margin: 5rem;
 
  @media (max-width: 1320px) {
    width: 95vw;
    
  }
  @media (max-width: 500px) {
    &>h1{
      font-size: 1.5rem;
      text-align: center;
    }
    
  }

`;

const MyPick = ({ authState, togglePick }) => {
  const {nickname} = authState
  const [pickItems, setPickItems] = useState([]);

  const deletePickTest = (festivalId) => {
    axios.delete(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/pick`,  {data : {festivalId}, headers: {
      accesstoken: sessionStorage.getItem("accesstoken"),
    }})
    .then(response => {
      console.log(response.data.message);
    })
    .catch(err => {
      console.log(err);
    })

      setPickItems(pickItems.filter((el) => el.festivalId !== festivalId));
  }

  useEffect(()=>{
     //* 새로고침시 유저가 픽한 상태도 유지되야 하므로
      axios.get(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/pick`, {headers: {
        accesstoken: sessionStorage.getItem("accesstoken"),
      }}
      ).then((response) => {
        console.log('MyPick',response.data);
        const pickedFestivals = response.data;
        //console.log(pickedFestivalId);
        // const festivalIdArr = pickedFestivalId.map(ele => ele.local_id)
        // const pickedFestivalByUser = festivalData.filter(ele => festivalIdArr.indexOf(ele.id) > -1)
        //{festivalId: 4}
        setPickItems(pickedFestivals);
      });
  }, [])

     

  
  return (
    <Wrapper>
      <h1> {nickname}님이 찜하신 축제들 입니다</h1>
      <Picklist
        togglePick={togglePick}
        pickItems={pickItems}
        deletePickTest={deletePickTest}
      />
    </Wrapper>
  );
};

export default MyPick;
