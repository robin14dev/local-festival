import React from "react";
import { useState, useRef } from "react";
import Signup from "./Signup";
import styled from "styled-components";
import axios from "axios";
import { RiAccountCircleFill } from "react-icons/ri";
import { AiFillLock } from "react-icons/ai";

const ModalContainer = styled.div`
 
  height: 100%;

  & > button {
    /* width: 20%; */
    height: 100%;
    border: none;
    color: white;
    font-weight: bolder;
    font-size: larger;
    transition: all 0.3s ease-in;
   & > *:hover {
    color: #eff622;

    transition: all 0.2s ease-out;
      cursor: pointer; ;
   }
   
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalView = styled.div`
  border-radius: 10px;
  background-color: white;
  padding: 1rem;
  width: 30rem;
  height: 55vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > h1 {
    font-size: 3rem;
  cursor: pointer;
  font-style: italic;
  font-family: 'HS-Regular';
  color: #1564a9;
  }

  & > div:nth-child(4) {
    /* background-color: #ef8d8d; */
    display: flex;
    width: 20rem;
    justify-content: space-between;
    align-items: center;
    height: 3rem;
   &  > *  {
    font-size: 1rem;
   }
    & > button {
      border-right: 1px solid lightgray;
      padding: 0 2rem;
    }
    & >div {
      margin-right: 3rem;
    }
  }
`;

const LoginControl = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: yellowgreen; */
`;

const InputsInColumn = styled.div`

  width: 20rem;
  /* background-color: yellow; */
  & > div {
    display: flex;
    justify-content: space-between;
    /* height: 2rem; */
    margin : 0.5rem 0;
    font-size: 3rem;
    align-items: center;
   

    & > input {
      width: 100%;
      height: 3rem;
      font-size: 35%;
      padding-left: 1rem;
      border : 1px solid lightgray;
      border-radius: 0.3rem;
    }
  }
 
`;


const LoginButton = styled.button`
 
    border-radius: 4px;
    margin: 0.5rem 0 ;
    color: white;
    font-weight: bold;
    cursor: pointer;
    height: 3rem;
    width: 100%;
    font-size: 1rem;
    transition: all 0.2s ease-out;
    background-color: #1564a9;

    
    
    &:active {
      color: #6cf7a6;
    }
  
`;

const GoogleLoginControl = styled.div`
  display: relative;
  button {
    /* ?????? ????????? */
    outline: none;
    border: none;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-top: 4px;
    margin-bottom: 15px;

    /* ?????? */
    height: 2rem;
    width: 15rem;
    font-size: 1rem;

    /* ?????? */
    background: #4285f4;
    transition: transform 0.2s ease-out;
        &:hover {
    transform: scale(1.1);;
    }
    &:active {
      background: #2366d2;
    }
  }
`;

const KakaoLoginControl = styled.div`
  display: relative;
  button {
    /* ?????? ????????? */
    outline: none;
    border: none;
    border-radius: 4px;
    color: #000000c1;
    font-weight: bold;
    cursor: pointer;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-bottom: 15px;

    /* ?????? */
    height: 2rem;
    width: 15rem;
    font-size: 1rem;

    /* ?????? */
    background: #fee500;
    transition: transform 0.2s ease-out;
        &:hover {
    transform: scale(1.1);
    }
    &:active {
      background: #ccb801;
    }
  }
`;

const CancelControl = styled.div`
  display: relative;
  button {
    /* ?????? ????????? */
    outline: none;
    border: none;
    border-radius: 4px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-top: 0.5rem;

    /* ?????? */
    height: 2rem;
    width: 6.5rem;
    font-size: 1rem;

    /* ?????? */
    background-color: #1564a9;
    transition: transform 0.2s ease-out;
        &:hover {
    transform: scale(1.1);
   
   
    }
    &:active {
      color: #6cf7a6;    }
  }
`;

const ErrorMessage = styled.div`
color: red;
font-weight: bold;
`

const Login = ({ loginHandler }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [account, setaccount] = useState("");
  const [password, setPassword] = useState("");

  const handleaccount = (e) => {
    setaccount(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
   
    //# ????????? ?????? ??? ????????? ???????????? ?????? ?????? (?????? ??????)
    axios
      .post(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/users/signin`, {
        account: account,
        password: password,
      })
      .then((response) => {
      
          //# ????????? ??????????????? ????????????.
          // localStorage.setItem("accessToken", response.data.token);
          sessionStorage.setItem("accesstoken", response.data.data.token);

          const { nickname, userId, account } = response.data.data;
          //# ?????? ??????
        //  console.log('??????????????????', response.data.data);
          loginHandler(userId, account, nickname, true);
        // }
      })
      .catch((err) => {
        console.log(err.response.data.message);
       if(err.response.data.message === "Wrong account And Password Combination") {
        errorMessage.current.textContent = "??????????????? ???????????? ????????????"
       
       } else if(err.response.data.message === "User Doesn't Exist"){
        errorMessage.current.textContent = "???????????? ???????????? ????????????"
       } else {
        console.log('???????????????');
       }
      });

    // }
  };

  const openModalHandler = () => {
    setIsOpen(!isOpen);
  };

  const openModalHandlerLogin = () => {
    console.log("here!!!!");
    setIsOpen(!isOpen);
  };

  const errorMessage = useRef()

  return (
    <ModalContainer>
      <button onClick={openModalHandler}><RiAccountCircleFill size={45}/></button>
      {isOpen ? (
        <ModalBackdrop onClick={openModalHandler}>
          <ModalView
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h1>LoCo</h1> 
            <ErrorMessage ref={errorMessage}></ErrorMessage>
            <LoginControl>
                <InputsInColumn>
                  <div>
                      <input id="account" type="text" value={account} required placeholder="?????????" onChange={(e) => {handleaccount(e)}}/>
                  </div>
                  <div>
                      <input id="password" type="text" value={password} required placeholder="????????????" onChange={(e) => {handlePassword(e)}}/>
                  </div>
                </InputsInColumn>
                <LoginButton onClick={handleSubmit}>?????????</LoginButton>
            </LoginControl>
            <div>
              <button>???????????? ?????????</button>
              <Signup openModalHandlerLogin={openModalHandlerLogin} />
            </div>
          </ModalView>
        </ModalBackdrop>
      ) : null}
    </ModalContainer>
  );
};

export default Login;
