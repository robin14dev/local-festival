import styled from "styled-components";
import { Wrapper as W } from "../../Loading";
export const ModalContainer = styled.div<{ isHide: boolean }>`
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

export const LoadingWrapper = styled(W)`
  width: 100%;
  h1 {
    font-size: 4rem;
  }
`;
export const LoginSection = styled.div`
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