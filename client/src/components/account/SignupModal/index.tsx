import axios, { AxiosError } from "axios";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { ReactComponent as ServerFail } from "../../../assets/server-fail.svg";
import Loading from "../../Loading";
import {
  ModalContainer,
  LoadingWrapper,
  ShowValid,
  LoginSection,
  Backdrop,
} from "./styled";
import { validate, rgx, message, userInfo, Progress } from "./validation";
import { ConfirmIcon } from "assets";
import { ModalDispatchContext } from "contexts/ModalContext";



/**
 * TODO : 내용물만 바꾸고 싶은데
 *
 * 로그인 모달에서는 회원가입 모달로 가게할 수 있고
 * 회원가입 모달에서는 로그인 모달로 갈 수 있게 하고
 *
 * 부모 만들고
 *
 * type login, signup에 따라서 렌더링 되도록
 *
 * 아니면 LoginSection의존성 떨어뜨려서 context를 만들어야되나??
 *
 * AuthModalContainer로 하고 이 안에서 LoginModal, SignupModal 선택적으로 렌더링 하는 방법
 * loginModalContext를 AuthmodalContext로 바꾸기
 *
 *
 */

const SignupModal = () => {
  console.log('signupModal!!');
  
  const setModalKey = useContext(ModalDispatchContext)
  const [userInfo, setUserInfo] = useState<userInfo>({
    account: { text: "", isValid: false, isUnique: false },
    nickname: { text: "", isValid: false, isUnique: false },
    password: { text: "", isValid: false },
    passwordCheck: { text: "", isValid: false },
  });
  const [validMsg, setValidMsg] = useState({
    account: "",
    nickname: "",
    password: "",
    passwordCheck: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState<Progress>("inProgress");
  const [isHide, setIsHide] = useState(false);
  const { account, nickname, password, passwordCheck } = userInfo;

  const handleUserInfo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      //# 유효성 검사 실패시 isValid: false로 바꾸고 리턴

      const checkType = e.target.name;
      const value = e.target.value;

      if (validate(checkType, value, rgx, password.text)) {
        // 유저정보 변경
        setUserInfo((prevInfo) => {
          const nextInfo = {
            ...prevInfo,
            [checkType]: { ...prevInfo[checkType], text: value, isValid: true },
          };
          if (checkType === "account" || checkType === "nickname") {
            console.log(checkType);

            Object.assign(nextInfo[checkType], { isUnique: false });
          }
          return nextInfo;
        });
        // - 메시지 변경 (유효성 통과)
        setValidMsg((prevMsg) => ({
          ...prevMsg,
          [checkType]: message[checkType].success,
        }));
        // dom 색깔 변경 => styled-component 조건부로 해결
        //! - 중복확인 버튼 활성화 => dom 조건부로 해결
      } else {
        //빈값인 경우
        setUserInfo((prevInfo) => {
          const nextInfo = {
            ...prevInfo,
            [checkType]: {
              ...prevInfo[checkType],
              text: value,
              isValid: false,
            },
          };
          if (checkType === "account" || checkType === "nickname") {
            Object.assign(nextInfo[checkType], { isUnique: false });
          }
          return nextInfo;
        });
        //빈값이어서 실패한 경우
        if (value.length === 0) {
          setValidMsg((prevMsg) => ({
            ...prevMsg,
            [checkType]: "",
          }));
        } else {
          //빈값이 아닌 입력값이 유효성에  실패한 경우
          // - 메시지 변경 (유효성 실패)
          setValidMsg((prevMsg) => ({
            ...prevMsg,
            [checkType]: message[checkType].fail,
          }));
          // dom 색깔 변경 => styled-component 조건부로 해결
          //! - 중복확인 버튼 비활성화 => dom 조건부로 해결
        }
      }
    },
    [userInfo, message]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault();
      console.log("submit");

      const validUserInfo = (): boolean => {
        for (const info in userInfo) {
          if (userInfo[info].isValid === false) return false;
          /* //!isUnique 있으면 true인지도 확인 false면 바로 false */
          if (
            userInfo[info].hasOwnProperty("isUnique") &&
            userInfo[info]["isUnique"] === false
          )
            return false;
        }
        return true;
      };

      //# 유효성 검사와 중복 체크가 하나라도 false면 return
      if (validUserInfo() === false) return;

      //# 유효성 검증 & 중복체크 통과시, 서버에 회원가입 정보 전송

      try {
        setLoading(true);
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/users/signup`, {
          account: account.text,
          password: password.text,
          nickname: nickname.text,
        });
        console.log("success!!");

        //# 회원가입 성공시, 성공메시지와 함께 3초 뒤 로그인 모달로 이동

        setProgress("success");
        setLoading(false);
      } catch (error) {
        console.log("fail!!");
        console.log(error);
        setProgress("failed");
        setLoading(false);
      }
    },
    [userInfo]
  );

  const duplicateCheck = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const checkType = e.currentTarget.name;

    console.log("duplicaatecheck");

    if (userInfo[checkType].isValid === false) {
      //console.log('중복확인 누를 때 유효성 검사가 통과되지 않은경우');
      return;
    }
    //console.log('중복확인 누를 때 유효성 검사가 통과된경우');

    try {
      await axios.get(`${process.env.REACT_APP_SERVER_URL}/users/signup`, {
        params: { [checkType]: userInfo[checkType].text },
      });
      // 중복확인 버튼 비활성화 dom disabled로 해결

      setValidMsg((prevMsg) => ({
        ...prevMsg,
        [checkType]: message[checkType].unique,
      }));
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        [checkType]: {
          ...prevInfo[checkType],
          isUnique: true,
        },
      }));
      // 중복 메시지 색깔 styled-componnet로 해결
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.log(err.response);
        if (err.response?.data === `Already ${checkType}`) {
          console.log("here!!");

          setUserInfo((prevInfo) => ({
            ...prevInfo,
            [checkType]: {
              ...prevInfo[checkType],
              isUnique: false,
            },
          }));
          setValidMsg((prevMsg) => ({
            ...prevMsg,
            [checkType]: message[checkType].exist,
          }));
        }
      }
    }
  };
  const closeModal = () => {
    setModalKey('')
  }

  const openLoginModal = () => {
    setModalKey('LoginModal')
  }

  const Success = () => {
    const [count, setCount] = useState(3);

    useEffect(() => {
      // const timer = setInterval(() => {
      //   setCount((prevCount) => prevCount - 1);
      // }, 1000);

      // let closeModal = setTimeout(() => {
      //   setIsSignup(false);
      //   setIsLogin(true);
      // }, 4000);
      // return () => {
      //   clearInterval(timer);
      //   clearInterval(closeModal);
      // };
    }, []);
    return (
      <div className="signupSuccess">
        <h1>
          Let's{" "}
          <span style={{ color: "var(--primaryOrange)", fontSize: "5rem" }}>
            LoCo
          </span>
        </h1>
        <img src={ConfirmIcon}/>
        <div>
          <p>
            환영합니다 <span>{nickname.text}</span>님!
          </p>
          <p>회원 가입이 완료되었습니다</p>
          <p>
            <span style={{ color: "var(--primaryPurple)" }}>{count}</span>초
            뒤에 <span>로그인</span>화면으로 넘어갑니다
          </p>
        </div>
      </div>
    );
  };

  return (
    <Backdrop onClick={closeModal}>

    <ModalContainer
      onClick={(e) => {
        e.stopPropagation();
      }}
      isHide={isHide}
    >
      {isLoading && (
        <LoadingWrapper>
          <h1>Loco</h1>
          <Loading text={"Loading"} />
        </LoadingWrapper>
      )}
      {!isLoading && progress === "inProgress" ? (
        <div className="signupForm">
          <h1>LoCo</h1>
          <form>
            <div className="validInfo">
              <label htmlFor="account">이메일 주소</label>{" "}
              <ShowValid
                checkType={"account"}
                isValid={account.isValid}
                isUnique={account.isUnique}
              >
                {validMsg.account}
              </ShowValid>
              <button
                name="account"
                onClick={duplicateCheck}
                disabled={!account.isValid || account.isUnique}
              >
                중복 확인
              </button>
            </div>
            <input
              name="account"
              type="text"
              value={account.text}
              required
              onChange={handleUserInfo}
            />
            <div className="validInfo">
              <label htmlFor="nickname">닉네임</label>
              <ShowValid
                checkType={"nickname"}
                isValid={nickname.isValid}
                isUnique={nickname.isUnique}
              >
                {validMsg.nickname}
              </ShowValid>
              <button
                name="nickname"
                onClick={duplicateCheck}
                disabled={!nickname.isValid || nickname.isUnique}
              >
                중복 확인
              </button>
            </div>
            <input
              name="nickname"
              type="text"
              value={nickname.text}
              required
              onChange={handleUserInfo}
            />
            <div className="validInfo">
              <label htmlFor="password">비밀번호</label>{" "}
              <ShowValid checkType="password" isValid={password.isValid}>
                {validMsg.password}
              </ShowValid>
            </div>
            <input
              name="password"
              type="password"
              value={password.text}
              required
              onChange={handleUserInfo}
            />
            <div className="validInfo">
              <label htmlFor="passwordCheck">비밀번호 확인</label>
              <ShowValid
                checkType="passwordCheck"
                isValid={passwordCheck.isValid}
              >
                {validMsg.passwordCheck}
              </ShowValid>
            </div>
            <input
              name="passwordCheck"
              type="password"
              value={passwordCheck.text}
              required
              onChange={handleUserInfo}
            />
            <button onClick={handleSubmit}>회원가입</button>
          </form>

          <LoginSection>
            <p>이미 계정이 있으신가요?</p>
            <button
              onClick={() => {
                setIsHide(true);
                openLoginModal()
                // setTimeout(() => {
                //   setIsSignup(false);
                //   setIsLogin(true);
                // }, 150);
              }}
            >
              로그인
            </button>
          </LoginSection>
          <button
            className="modalClose"
            onClick={() => {
              // setIsSignup(false);
            }}
          >
            돌아가기
          </button>
        </div>
      ) : !isLoading && progress === "success" ? (
        <Success />
      ) : !isLoading && progress === "failed" ? (
        <div className="errMessage">
          <h1>
            Let's{" "}
            <span style={{ color: "var(--primaryOrange)", fontSize: "5rem" }}>
              LoCo
            </span>
          </h1>
          <ServerFail />
          <div>
            <p>서버와의 연결이 끊어졌습니다</p>
            <p>잠시 후에 다시 시도해 주세요</p>
          </div>
          <button
            onClick={() => {
              // setIsSignup(false);
            }}
          >
            메인페이지로 돌아가기
          </button>
        </div>
      ) : null}
    </ModalContainer>
    </Backdrop>
   
  );
};

export default SignupModal;
