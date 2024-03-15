import React, { useCallback, useContext, useState } from "react";
import axios, { AxiosError } from "axios";
import { UserContext } from "contexts/userContext";
import { ModalDispatchContext } from "contexts/ModalContext";
import { Backdrop, Container } from "./styled";

const LoginModal = () => {
  const setModalKey = useContext(ModalDispatchContext)
  const { setAuthState } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState({ account: "", password: "" });
  const { account, password } = userInfo;
  const [errMessage, setErrMessage] = useState("");
  


  const errMessages = [
    "사용자가 존재하지 않습니다",
    "비밀번호가 일치하지 않습니다",
  ];
  const handleUserInfo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length > 0) setErrMessage("");
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/users/signin`,
        {
          account: userInfo.account,
          password: userInfo.password,
        }
      );
      const { nickname, userId, account, defaultPic, token } =
        response.data.info;
      const user = {
        account,
        nickname,
        userId,
        defaultPic,
        loginStatus: true,
      };

      /**
       * getPickItems를 여기서 할 수 없잖아, setPickItems를 여기서 할 수 없으니깐 => context를 만들어야겠고 상태관리 툴 사용해야겠네
       */

      setAuthState(user);
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("accesstoken", token);



      modalClose();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data.message);
        if (
          err.response?.data.message ===
          "Wrong account And Password Combination"
        ) {
          setErrMessage(errMessages[1]);
        } else if (err.response?.data.message === "User Doesn't Exist") {
          setErrMessage(errMessages[0]);
        } else {
          console.log("그밖에에러");
        }
      } else {
        console.log(err);
      }
    }
  };
  const modalClose = () => {
    setModalKey('')
  };
  const openSignupModal = () => {
    setModalKey('SignupModal')
  }



  return (
      <Backdrop onClick={modalClose}>
        <Container
          data-testid="LoginModal"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <h1>Loco</h1>
          <form onSubmit={handleSubmit}>
            <input
              name="account"
              placeholder="email을 입력해 주세요"
              onChange={handleUserInfo}
              type="text"
              value={account}
              required
            ></input>
            <div>
              {errMessage === "사용자가 존재하지 않습니다" && errMessage}
            </div>
            <input
              name="password"
              placeholder="비밀번호를 입력해 주세요"
              onChange={handleUserInfo}
              type="password"
              value={password}
              required
            ></input>
            <div>
              {errMessage === "비밀번호가 일치하지 않습니다" && errMessage}
            </div>
            <button>로그인</button>
          </form>
          <div className="footer">
            <span>아직 계정이 없으신가요?</span>
            <button type="button"
              onClick={openSignupModal}
            >
              회원가입
            </button>
          </div>
       
        </Container>
      </Backdrop>
  );
};

export default LoginModal;
