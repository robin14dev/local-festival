import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import axios, { AxiosError } from "axios";
import moment from "moment";
import Withdraw from "../../components/account/WithdrawModal";
import DefaultPic from "../../components/account/defaultPic/DefaultPic";
import { Helmet } from "react-helmet";
import EditImg from "../../assets/edit-mobile.png";
import DeleteImg from "../../assets/delete-mobile.png";
import { ConfirmIcon, InvalidIcon as CancelIcon } from "assets";

import { ReactComponent as Fail } from "../../assets/server-fail.svg";
import {
  userInfo,
  validate,
  rgx,
  message,
  Progress,
} from "components/account/SignupModal/validation";

import Modal from "../../components/Modal";
import { UserContext } from "../../contexts/userContext";
import {
  Wrapper,
  List,
  Info,
  Heading,
  Toggle,
  Nickname,
  Button,
  ValidMsg,
  Password,
} from "./styled";

export default function Account() {
  const { authState, setAuthState } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState({
    nickname: false,
    password: false,
  });
  const [userInfo, setUserInfo] = useState<userInfo>({
    nickname: { text: "", isValid: false, isUnique: false },
    password: { text: "", isValid: false },
    passwordCheck: { text: "", isValid: false },
    curPassword: { text: "", isValid: true },
  });
  const [validMsg, setValidMsg] = useState({
    nickname: "",
    password: "",
    passwordCheck: "",
    curPassword: "",
  });
  const [withdraw, setWithdraw] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState<Progress>("inProgress");
  const [updatedAt, setUpdatedAt] = useState("");

  const editType = useRef<null | string>(null);
  const inputhere = useRef<HTMLInputElement | null>(null);
  const errMessagePwd = useRef<HTMLSpanElement | null>(null);
  const pwRef = useRef<HTMLInputElement>(null);
  const curpwRef = useRef<HTMLInputElement>(null);
  const pwcheckRef = useRef<HTMLInputElement>(null);

  const { nickname, password, passwordCheck, curPassword } = userInfo;

  useEffect(() => {
    console.log("accountSetting!!");
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/users/edit`, {
        headers: { accesstoken: sessionStorage.getItem("accesstoken") ?? "" },
      })
      .then((response) => {
        console.log(response);
        setUpdatedAt(response.data.updatedAt);
      });
  }, []);
  const changeNickname = (nickname: string) => {
    setAuthState((prevAuth) => ({ ...prevAuth, nickname }));
  };
  const duplicateCheck = async (type: string, value: string) => {
    const checkType = type;

    console.log("duplicaatecheck");
    console.log(value, checkType, userInfo);

    // if (userInfo[checkType].isValid === false) {
    //   console.log('중복확인 누를 때 유효성 검사가 통과되지 않은경우');
    //   return;
    // }
    console.log("중복확인 누를 때 유효성 검사가 통과된경우");

    try {
      await axios.get(`${process.env.REACT_APP_SERVER_URL}/users/signup`, {
        params: { [checkType]: value },
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
        if (err.message === "Network Error") {
          setProgress("failed");
          setLoading(false);
        }

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
  const handleUserInfo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      //# 유효성 검사 실패시 isValid: false로 바꾸고 리턴

      const checkType = e.target.name;
      const value = e.target.value;

      if (progress === "success" || progress === "failed") {
        console.log("here");

        setProgress("inProgress");
      }

      if (checkType === "curPassword") {
        setUserInfo((prevInfo) => ({
          ...prevInfo,
          [checkType]: { ...prevInfo[checkType], text: value, isValid: true },
        }));
        if (value.length !== 0)
          return setValidMsg((prevMsg) => ({
            ...prevMsg,
            [checkType]: "",
          }));
      }

      if (validate(checkType, value, rgx, password.text)) {
        console.log(checkType, value);

        // 유저정보 변경
        setUserInfo((prevInfo) => {
          const nextInfo = {
            ...prevInfo,
            [checkType]: { ...prevInfo[checkType], text: value, isValid: true },
          };
          if (checkType === "nickname") {
            console.log(checkType);

            Object.assign(nextInfo[checkType], { isUnique: false });
          }
          return nextInfo;
        });
        // - 메시지 변경 (유효성 통과)
        setValidMsg((prevMsg) => ({
          ...prevMsg,
          [checkType]: "",
        }));

        if (checkType === "nickname") {
          duplicateCheck(checkType, value);
        }
      } else {
        //# 유효성 실패시 isValid false
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
        //# 메시지 보여주기
        //빈값이어서 실패한 경우
        if (value.length === 0) {
          setValidMsg((prevMsg) => ({
            ...prevMsg,
            [checkType]: "",
          }));
        } else {
          //빈값이 아닌 입력값이 유효성에  실패한 경우
          setValidMsg((prevMsg) => ({
            ...prevMsg,
            [checkType]: message[checkType].fail,
          }));
        }
      }
    },
    [userInfo, message, progress],
  );
  const accordionHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.currentTarget as HTMLButtonElement;
      const checkType = target.name as "nickname" | "password";

      if (isOpen[checkType] === false) {
        // 닫혀있으면 열고
        return setIsOpen((prev) => ({ ...prev, [checkType]: true }));
      }

      if (isOpen[checkType] === true) {
        // 열려있으면 닫고
        setIsOpen((prev) => ({ ...prev, [checkType]: false }));

        //# 닫을 때 해당 입력값 초기화 해주기(userInfo)
        setUserInfo((prevInfo) => {
          const nextInfo = {
            ...prevInfo,
            [checkType]: { ...[checkType], text: "", isValid: false },
          };
          if (checkType === "password") {
            Object.assign(nextInfo, {
              passwordCheck: { text: "", isValid: false },
              curPassword: { text: "", isValid: true },
            });
          }

          return nextInfo;
        });
        //# 메시지도 초기화 해주기
        setValidMsg((prevMsg) => {
          const nextMsg = {
            ...prevMsg,
            [checkType]: "",
          };
          if (checkType === "password") {
            Object.assign(nextMsg, { passwordCheck: "", curPassword: "" });
          }
          return nextMsg;
        });
      }
    },
    [isOpen],
  );
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    ...type: string[]
  ) => {
    e.preventDefault();
    const typeList = [...type];

    const validUserInfo = (typeList: string[]): boolean => {
      for (const type of typeList) {
        if (userInfo[type].isValid === false) return false;
        /* //!isUnique 있으면 true인지도 확인 false면 바로 false */
        if (
          userInfo[type].hasOwnProperty("isUnique") &&
          userInfo[type]["isUnique"] === false
        )
          return false;
      }
      return true;
    };

    if (validUserInfo(typeList) === false) return;
    if (progress === "success" || progress === "failed") {
      setProgress("inProgress");
    }
    if (typeList[0] === "nickname") {
      const checkType = "nickname";
      setLoading(true);
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/users/nickname`,
          { nickname: userInfo.nickname.text },
          {
            headers: {
              accesstoken: sessionStorage.getItem("accesstoken") ?? "",
            },
          },
        );
        const nextNickname = response.data.data.nickname;

        // 젼역정보수정
        changeNickname(nextNickname);

        // 모달메시지 세팅
        editType.current = "닉네임이";
        setProgress("success");
        setLoading(false);
        // 아코디언 닫기
        setIsOpen((prev) => ({ ...prev, [typeList[0]]: false }));

        // 기존 입력값과 메시지 초기화
        setValidMsg((prevMsg) => {
          const nextMsg = {
            ...prevMsg,
            [checkType]: "",
          };

          return nextMsg;
        });
        setUserInfo((prevInfo) => {
          const nextInfo = {
            ...prevInfo,
            [checkType]: {
              ...prevInfo[checkType],
              isValid: false,
              text: "",
              isUnique: false,
            },
          };

          return nextInfo;
        });
        //! 세션 상태도 바꿔주기

        // 기본 상태로 바꾸기
        setTimeout(() => {
          setProgress("inProgress");
        }, 3000);
      } catch (error) {
        setLoading(false);
        setProgress("failed");
      }
    }

    if (typeList[0] === "password") {
      const { curPassword, password, passwordCheck } = userInfo;
      const pwdForm = {
        currentPassword: curPassword.text,
        newPassword: password.text,
        passwordCheck: passwordCheck.text,
      };

      try {
        //# 비밀번호칸 입력하고 비밀번호 확인칸 입력하고 비밀번호칸을 수정했을 때 에러 체크
        if (password.text !== passwordCheck.text)
          throw new Error("passwordCheck is not valid");

        setLoading(true);
        const response = await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/users/password`,
          pwdForm,
          {
            headers: {
              accesstoken: sessionStorage.getItem("accesstoken") ?? "",
            },
          },
        );

        const { updatedAt } = response.data;

        // input값들 초기화
        setUserInfo((prevInfo) => ({
          ...prevInfo,
          password: { ...password, text: "", isValid: false },
          passwordCheck: { ...passwordCheck, text: "", isValid: false },
          curPassword: { ...password, text: "" },
        }));

        //모달메시지 준비
        editType.current = "비밀번호가";

        // 아코디언 닫으면서 최종수정일 업데이트
        setUpdatedAt(updatedAt);
        setIsOpen((prev) => ({ ...prev, [typeList[0]]: false }));

        //모달 띄우기
        setProgress("success");
        setLoading(false);

        setTimeout(() => {
          setProgress("inProgress");
        }, 3000);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message === "passwordCheck is not valid") {
            setUserInfo((prevInfo) => ({
              ...prevInfo,
              passwordCheck: { ...passwordCheck, isValid: false },
            }));
            setValidMsg((prevMsg) => ({
              ...prevMsg,
              passwordCheck: message.passwordCheck.fail,
            }));
            if (pwcheckRef.current) {
              pwcheckRef.current.focus();
            }
            return;
          }
        }

        //! 아래 지우면 안됨
        if (err instanceof AxiosError) {
          if (err.message === "Network Error") {
            setProgress("failed");
            setLoading(false);
          }

          if (
            err.response?.data.message ===
            "New password cannot be the same as the current password"
          ) {
            setLoading(false);
            const checkType = "password";

            setUserInfo((prevInfo) => ({
              ...prevInfo,
              password: { ...password, isValid: false },
            }));

            setValidMsg((prevMsg) => {
              const nextMsg = Object.assign(prevMsg, {
                [checkType]: message[checkType].exist,
              });

              return nextMsg;
            });

            if (pwRef.current) {
              pwRef.current.focus();
            }
            return;
          }

          if (err.response?.data.message === "Wrong Password") {
            setLoading(false);
            const checkType = "curPassword";
            setUserInfo((prevInfo) => {
              const nextInfo = {
                ...prevInfo,
                [checkType]: {
                  ...prevInfo[checkType],
                  isValid: false,
                },
              };

              return nextInfo;
            });
            setValidMsg((prevMsg) => ({
              ...prevMsg,
              [checkType]: message[checkType].fail,
            }));
            if (curpwRef.current) {
              curpwRef.current.focus();
            }
            return;
          }
        }

        console.log(err);
      }
    }
  };
  const onClickLogout = useCallback(() => {
    sessionStorage.clear();
    window.location.replace("/");
  }, []);

  return (
    <>
      {withdraw && <Withdraw setWithdraw={setWithdraw} />}
      <Wrapper data-testid="AccountPage">
        <Helmet>
          <title>계정 관리 - LOCO</title>
        </Helmet>
        <h1>계정</h1>
        <DefaultPic initialUrl={authState.defaultPic} />
        <List>
          <Info>
            <Heading>
              <h4>닉네임</h4>
              <Toggle>
                <button name="nickname" onClick={accordionHandler}>
                  {isOpen.nickname ? (
                    <img src={CancelIcon}/>
                   
                  ) : (
                    <img src={EditImg} alt="수정" />
                  )}
                </button>
              </Toggle>
            </Heading>

            {isOpen.nickname ? (
              <Nickname>
                <label htmlFor="nickname">변경할 닉네임을 입력해 주세요</label>
                <br></br>

                <form onSubmit={(e) => handleSubmit(e, "nickname")}>
                  <input
                    className={`input-valid ${
                      nickname.text
                        ? nickname.isValid
                          ? "valid"
                          : "not-valid"
                        : ""
                    }`}
                    ref={inputhere}
                    onChange={handleUserInfo}
                    placeholder={authState.nickname}
                    name="nickname"
                    value={nickname.text}
                  ></input>
                  <ValidMsg
                    checkType={"nickname"}
                    isValid={nickname.isValid}
                    isUnique={nickname.isUnique}
                  >
                    {validMsg.nickname}
                  </ValidMsg>

                  <Button
                    isLoading={isLoading}
                    disabled={!(nickname.isValid && nickname.isUnique)}
                    type="submit"
                  >
                    <span>수정하기</span>
                  </Button>
                </form>
              </Nickname>
            ) : (
              <div className="updated-nickname" style={{ color: "gray" }}>
                {authState.nickname}
              </div>
            )}
          </Info>

          <Info>
            <Heading>
              <h4>비밀번호</h4>
              <Toggle>
                <button name="password" onClick={accordionHandler}>
                  {isOpen.password ? (
                    <img src={CancelIcon}/>
                  ) : (
                    <img src={EditImg} alt="수정" />
                  )}
                </button>
              </Toggle>
            </Heading>

            {isOpen.password && (
              <Password>
                <form
                  onSubmit={(e) => handleSubmit(e, "password", "passwordCheck")}
                >
                  <label htmlFor="curPassword">현재 비밀번호</label>
                  <br />
                  <input
                    ref={curpwRef}
                    className={`input-valid ${
                      curPassword.text
                        ? curPassword.isValid
                          ? "valid"
                          : "not-valid"
                        : ""
                    }`}
                    required
                    type={"password"}
                    onChange={handleUserInfo}
                    name="curPassword"
                    value={curPassword.text}
                  />
                  <ValidMsg
                    checkType={"curPassword"}
                    isValid={curPassword.isValid}
                  >
                    {validMsg.curPassword}
                  </ValidMsg>
                  <label htmlFor="password">새 비밀번호</label>
                  <br />
                  <input
                    ref={pwRef}
                    className={`input-valid ${
                      password.text
                        ? password.isValid
                          ? "valid"
                          : "not-valid"
                        : ""
                    }`}
                    required
                    type={"password"}
                    onChange={handleUserInfo}
                    name="password"
                    value={password.text}
                  />
                  <ValidMsg checkType={"password"} isValid={password.isValid}>
                    {validMsg.password}
                  </ValidMsg>
                  <label htmlFor="passwordCheck">비밀번호 확인</label>
                  <br />
                  <input
                    ref={pwcheckRef}
                    className={`input-valid ${
                      passwordCheck.text
                        ? passwordCheck.isValid
                          ? "valid"
                          : "not-valid"
                        : ""
                    }`}
                    required
                    type={"password"}
                    onChange={handleUserInfo}
                    name="passwordCheck"
                    value={passwordCheck.text}
                  />
                  <ValidMsg
                    checkType={"passwordCheck"}
                    isValid={passwordCheck.isValid}
                  >
                    {validMsg.passwordCheck}{" "}
                  </ValidMsg>
                  <Button
                    isLoading={isLoading}
                    disabled={!(password.isValid && passwordCheck.isValid)}
                    type="submit"
                  >
                    <span>비밀번호 변경</span>
                  </Button>
                </form>
                <span ref={errMessagePwd}></span>
              </Password>
            )}
          </Info>
          <Info>
            <Heading>
              <h4>계정 삭제</h4>
              <Toggle>
                <button
                  onClick={() => {
                    console.log("계정삭제");
                    setWithdraw(true);
                  }}
                >
                  <img src={DeleteImg} alt="삭제" />
                </button>
              </Toggle>
            </Heading>
          </Info>
        </List>
        <div id="last-modified">
          최종수정일 : {moment(updatedAt).format("YYYY년 MM월 DD일 HH시 mm분")}
        </div>
        <span className="logout" onClick={onClickLogout}>
          로그아웃
        </span>
      </Wrapper>
      {!isLoading && progress === "success" && (
        <Modal
          timer={{ time: 3000 }}
          containerStyle={{ color: "black", width: "50vw", height: "" }}
          clickOption={{ back: false }}
          btnOption={{
            text: "확인",
            style: {
              color: "white",
              backGroundColor: "var(--primaryPurple)",
            },
          }}
        >
         <img src={ConfirmIcon}/>
          <div>
            <h1>{editType.current} 변경되었습니다</h1>
            <h2>잠시 후에 계정페이지로 돌아갑니다</h2>
          </div>
        </Modal>
      )}
      {!isLoading && progress === "failed" && (
        <Modal
          timer={null}
          containerStyle={{ color: "black", width: "50vw", height: "" }}
          clickOption={{ back: false }}
          btnOption={{
            text: "확인",
            style: {
              color: "white",
              backGroundColor: "var(--primaryPurple)",
            },
          }}
        >
          <Fail />
          <div>
            <h1>서버와의 연결에 실패했습니다</h1>
            <h2>잠시 후에 다시 시도해 주세요</h2>
          </div>
        </Modal>
      )}
    </>
  );
}
