import React, { useState } from "react";
import Login from "./Login";
import styled from "styled-components";
import HeartButton from "./HeartButton";
import EmptyHeart from "../assets/empty-heart.png"


const ModalContainer = styled.div`
  /* display: none; */
  height: 10%;
  &>img{
    width: 2rem;
    height: 2rem;
  }
`;
const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  /* bottom: 0;
  right: 0; */
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalView = styled.div`
  border-radius: 10px;
  background-color: #ffffff;
  width: 30vw;
  height: 40vh;
`;

// const PickupControl = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   /* border: 1px solid black; */
//   height: 8em;
// `;

// const InputsInColumn = styled.div`
//   display: flex;
//   flex-direction: column;
//   & > input {
//     margin: 0.2rem;
//   }
// `;

// const ButtonsInRow = styled.div`
//   display: flex;
//   & > button {
//     height: 2rem;
//     margin: 0.2rem;
//   }
// `;

const Moveloginpick = () => {
  console.log('hrer');
  const [isOpen, setIsOpen] = useState(false);
  const openModalHandler = (event) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const openModalHandlerMLP = ()=>{
    setIsOpen(!isOpen);
  }

  return (
    <ModalContainer>
      <img src={EmptyHeart}  onClick={openModalHandler}></img>
   
      {isOpen ? (
        <ModalBackdrop onClick={openModalHandler}>
          <ModalView onClick={(e) => {
              e.stopPropagation();
            }}>
         
            
          </ModalView>
        </ModalBackdrop>
      ) : null}
    </ModalContainer>
  );
};

export default Moveloginpick;


// onClick={(e) => {
//   e.stopPropagation();
// }}
// >

// <h2>로그인시 사용 가능합니다</h2>
// <h3>로그인 하시겠습니까?</h3>

//   <ButtonsInRow>
    
//       <button className="close-btn" onClick={openModalHandler}>
//         cancel
//       </button>
//       <Login openModalHandlerMLP={openModalHandlerMLP} />
    
  //</ButtonsInRow>