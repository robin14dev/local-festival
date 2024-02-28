import axios, { AxiosError } from "axios";
import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { ReactComponent as Confirm } from "../../assets/confirm.svg";
import { ReactComponent as ServerFail } from "../../assets/server-fail.svg";
import Loading, { Wrapper as W } from "../Loading";

const ModalContainer = styled.div<{ isHide: boolean }>`
  z-index: 100;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 27rem;
  height: 33.5rem;
  border-radius: 10px;
  background-color: white;
  padding: 1rem;

  animation-duration: 0.4s;
  animation-name: ${(props) => (props.isHide ? "slide-up" : "slide-down")};
  animation-fill-mode: forwards;

  h1 {
    font-size: 3rem;
    cursor: pointer;
    font-style: italic;
    font-family: "HS-Regular";
    color: var(--mainColor);
    margin-bottom: 0.5rem;
    text-align: center;
  }
  .signupForm {
    display: flex;
    flex-direction: column;
    width: 100%;
    form {
      display: flex;
      flex-direction: column;
      width: 100%;

      .validInfo {
        display: flex;
        justify-content: space-between;
        /* background-color: yellowgreen; */
        height: 1.8rem;

        label {
          font-size: 1rem;
          /* background-color: lightpink; */
          height: 100%;
          display: flex;
          align-items: center;
        }
        button {
          background-color: var(--mainColor);
          color: white;
          margin: 0 0.1rem;
          margin-left: 1rem;
          height: fit-content;
          padding: 0.2rem;
          border-radius: 0.2rem;
          font-size: 0.9rem;
          transition: all 0.2s;

          &:disabled {
            background-color: darkgray;
            &:hover {
              background-color: darkgray;
            }
          }
          &:hover {
            background-color: var(--primaryBlue);
          }
        }
      }

      input {
        width: 100%;
        height: 2.5rem;
        margin-bottom: 1rem;
        border: 1px solid lightgray;
        border-radius: 0.3rem;
        padding: 0.5rem;
      }

      & > button {
        border-radius: 4px;
        margin: 0.5rem 0;
        color: white;
        font-weight: bold;
        cursor: pointer;
        height: 3rem;
        width: 100%;
        font-size: 1rem;
        background-color: var(--mainColor);
        transition: all 0.2s;
        &:hover {
          background-color: var(--primaryBlue);
        }
      }
    }
  }

  .signupSuccess,
  .errMessage {
    display: flex;

    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    h1 {
      font-size: 4rem;
    }
    svg {
      width: 30%;
      height: 30%;
    }

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        font-size: 1.2rem;
        font-family: "NanumSquareRound";
        line-height: 1.8;
        &:nth-child(1) {
          font-weight: bold;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        &:nth-child(2) {
          /* color: var(--primaryOrange); */
        }

        &:nth-child(3) {
          span {
            font-size: 1.2rem;
            color: var(--primaryOrange);
          }
        }
        span {
          font-size: 1.8rem;
          color: var(--primaryPurple);
          font-weight: bold;
        }
      }
    }

    button {
      color: var(--primaryPurple);
      border-radius: 0.5rem;
      font-family: "NanumSquareRound";
      font-size: 1.1rem;
      border: 1.7px dashed var(--primaryPurple);
      padding: 0.3rem;
      transition: all 0.2s;
      &:hover {
        background-color: var(--primaryPurple);
        color: white;
        transform: translateY(-0.2rem);
      }
    }
  }

  .modalClose {
    display: none;
  }

  @media screen and (max-width: 428px) {
    width: 100%;
    height: 100%;
    border-radius: 0;

    .modalClose {
      display: block;
      color: gray;
      margin-top: 1rem;
    }
  }
`;

const LoadingWrapper = styled(W)`
  width: 100%;
  h1 {
    font-size: 4rem;
  }
`;
const LoginSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  p {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  button {
    margin-left: 1.2rem;
    color: var(--mainColor);
    font-weight: bold;
    font-size: 1rem;
    transition: all 0.2s;

    &:hover {
      color: var(--primaryOrange);
    }
  }
`;

export const ShowValid = styled.div<{
  checkType: string;
  isValid: boolean;
  isUnique?: boolean;
}>`
  font-size: 0.8rem;
  font-weight: bold;
  font-family: "NanumSquareRound";
  word-break: normal;
  padding-left: 0.5rem;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${({ isValid, checkType }) =>
    isValid === false
      ? "var(--primaryPink)"
      : checkType === "nickname" || checkType === "account"
        ? "orange"
        : "var(--primaryBlue)"};
  color: ${({ isUnique }) => isUnique && "var(--primaryBlue)"};
`;

type SignupModalProps = {
  setIsSignup: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

type Message = {
  [index: string]: {
    success?: string;
    fail: string;

    exist?: string;
    unique?: string;
  };
};

export type userInfo = {
  [index: string]: {
    text: string;
    isValid: boolean;
    isUnique?: boolean;
  };
};

type Rgx = {
  [index: string]: RegExp;
  account: RegExp;
  nickname: RegExp;
  password: RegExp;
};

export const rgx: Rgx = {
  account: /[a-z0-9_!#$%^&*()-]+\@+[a-z0-9]+\.[a-z]+/,
  nickname: /^[가-힣|a-z|A-Z|0-9|]{4,8}$/,
  password: /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!~@#$%^&+=]).*$/,
};
export const message: Message = {
  account: {
    success: "중복 확인을 눌러주세요",
    fail: "유효하지 않은 이메일 형식 입니다",
    exist: "이미 사용중인 이메일 입니다.",
    unique: "가입이 가능한 이메일입니다",
  },
  nickname: {
    success: "중복 확인을 눌러주세요",
    fail: "영문, 한글, 숫자 포함 4자에서 8자 이하여야 합니다",
    exist: "이미 사용중인 닉네임 입니다.",
    unique: "사용이 가능한 닉네임입니다",
  },
  password: {
    success: "사용이 가능한 비밀번호 입니다",
    fail: "영문, 숫자, 특수문자 조합으로 최소 8자리 이상이여야 합니다",
    exist: "새로운 비밀번호는 이전의 비밀번호와 같을 수 없습니다",
  },
  passwordCheck: {
    success: "비밀번호가 일치합니다",
    fail: "비밀번호가 일치하지 않습니다",
  },
  curPassword: {
    fail: "기존 비밀번호가 일치하지 않습니다",
  },
};

export function validate(
  type: string,
  value: string,
  rgx: Rgx,
  password: string,
) {
  // userInfo의 전체 키를 타입으로 하고 싶을 때

  //#1 빈값일때는 메시지 안보이게하고 return false
  if (value === "") {
    return false;
  }

  //#2 빈값이 아닐때 정규식 체크

  if (rgx[type]) {
    return rgx[type].test(value) ? true : false;
  } else {
    return password === value ? true : false;
  }
}
export type Progress = "inProgress" | "success" | "failed";

const Signup = ({ setIsSignup, setIsLogin }: SignupModalProps) => {
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
    [userInfo, message],
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
    [userInfo],
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

  const Success = () => {
    const [count, setCount] = useState(3);

    useEffect(() => {
      const timer = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);

      let closeModal = setTimeout(() => {
        setIsSignup(false);
        setIsLogin(true);
      }, 4000);
      return () => {
        clearInterval(timer);
        clearInterval(closeModal);
      };
    }, []);
    return (
      <div className="signupSuccess">
        <h1>
          Let's{" "}
          <span style={{ color: "var(--primaryOrange)", fontSize: "5rem" }}>
            LoCo
          </span>
        </h1>
        <Confirm />
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
                setTimeout(() => {
                  setIsSignup(false);
                  setIsLogin(true);
                }, 150);
              }}
            >
              로그인
            </button>
          </LoginSection>
          <button
            className="modalClose"
            onClick={() => {
              setIsSignup(false);
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
              setIsSignup(false);
            }}
          >
            메인페이지로 돌아가기
          </button>
        </div>
      ) : null}
    </ModalContainer>
  );
};

export default Signup;
