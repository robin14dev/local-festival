import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";

const ModalContainer = styled.div`
 &  button {
  font-size: 1rem;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30rem;
  height: 35rem;
  border-radius: 10px;
  background-color:white;
  padding: 1rem;
  
  & > h1 {
  font-size: 3rem;
  cursor: pointer;
  font-style: italic;
  font-family: 'HS-Regular';
  color: #1564a9;
  margin-bottom: 0.5rem;
  }

  & > div:nth-child(3) {
    & > button {
      margin-left: 1.2rem;
      color: #1564a9;
      font-weight: bold;
      font-size: 1rem;
    }
  }
`;
const SignupView = styled.div`
  width: 80%;
  margin: 0.5rem 0;
`;
const InputsInColumn = styled.div`
  display: flex;
  flex-direction: column;
  & > label {
    align-self: flex-start;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  & > input {
    height: 2.5rem;
    margin-bottom: 1rem;
    border: 1px solid lightgray;
    border-radius: 0.3rem;

  }
 
`;

const SignUpButton = styled.button`
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



const Signup = ({ openModalHandlerLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [account, setaccount] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");


  
  // const errorMessage = useRef()
  // errorMessage.textContent = 'aaa'
  const handleUserId = (e) => {
    setaccount(e.target.value);
  };
  const handleNickname = (e) => {
    setNickname(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordCheck = (e) => {
    setPasswordCheck(e.target.value);
  };

  const handleSubmit = () => {
    if (password !== passwordCheck) {
      console.log("password Not Match");
      // errorMessage.textContent = 'eeorr'
      // console.log(errorMessage);
      document.body.querySelector(".errorMessage").textContent =
        "비밀번호가 일치하지 않습니다";
        document.body.querySelector(".errorMessage").style.fontWeight = "bold"
    }  else {
      //# 유효성 검증 후 서버에 회원가입 정보 전송 (주석 해제)
      axios
        .post(`${process.env.REACT_APP_SERVER_ADDRESS_LOCAL}/users/signup`, {
          account: account,
          password: password,
          nickname: nickname,
        })
        .then((response) => {
          console.log(response.data.message);
          
          openModalHandler()
        })
        .catch((err) => {
         if(err.response.status === 409) {
          document.body.querySelector(".errorMessage").textContent =
        "이미 가입된 아이디 입니다.";
        document.body.querySelector(".errorMessage").style.fontWeight = "bold"
         }
          
        });
    }
  };

  const openModalHandler = () => {
    setIsOpen(!isOpen);
    // openModalHandlerLogin();
  };
  return (
    <ModalContainer>
      <button onClick={openModalHandler}>회원가입</button>
      {isOpen ? (
        <ModalBackdrop
          onClick={() => {
            openModalHandler();
            openModalHandlerLogin();
          }}
        >
          <ModalView
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h1>LoCo</h1>
            <SignupView>
              {/* <ErrorMessage ref={errorMessage} ></ErrorMessage> */}
              <div className="errorMessage" style={{ color: "Red" }}></div>
                <InputsInColumn>
                  <label htmlFor="account">
                    이메일 주소
                    </label>
                    <input
                      id="account"
                      type="text"
                      value={account}
                      required
                      onChange={(e) => {
                        handleUserId(e);
                      }}
                    />
                  
                  <label htmlFor="nickname">
                    닉네임
                    </label>
                    <input id="nickname"
                      type="text"
                      value={nickname}
                      required
                      onChange={(e) => {
                        handleNickname(e);
                      }}
                    />
                  

                  <label htmlFor="password">
                    비밀번호
                    </label>
                    <input id="password"
                      type="password"
                      value={password}
                      required
                      onChange={(e) => {
                        handlePassword(e);
                      }}
                    />
                   
                  <label htmlFor="passwordCheck">
                    비밀번호 확인
                    </label>
                    <input id="passwordCheck"
                      type="password"
                      value={passwordCheck}
                      required
                      onChange={(e) => {
                        handlePasswordCheck(e);
                      }}
                    />
                  
                </InputsInColumn>
                <SignUpButton onClick={handleSubmit}>회원가입</SignUpButton>  
            </SignupView>
            <div>
              이미 계정이 있으신가요? <button onClick={openModalHandler}>로그인</button>
            </div>
          </ModalView>
        </ModalBackdrop>
      ) : null}
    </ModalContainer>
  );
};

export default Signup;
