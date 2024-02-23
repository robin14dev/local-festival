import styled, { css } from "styled-components";
import { ShowValid } from "../../components/account/Signup";

const Wrapper = styled.div`
  margin: 8rem 5rem;
  h1 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .logout {
    display: none;
  }
  #last-modified {
    color: gray;
    margin: 1rem;
    margin-left: 0.5rem;
  }
  @media (max-width: 700px) {
    margin: 8rem 2rem;
  }
  @media (max-width: 485px) {
    & > h1 {
      padding-left: 1rem;
    }

    .logout {
      display: inline-block;
      margin: 1rem;
      text-decoration: underline;
    }
  }
  @media (max-width: 385px) {
    margin: 8rem 1rem;
    #last-modified {
      font-size: 0.8rem;
    }
  }
`;

const List = styled.div`
  transition: all 1s;
  margin-left: 0.5rem;

  @media (max-width: 485px) {
    margin: 0;
  }
`;

const Info = styled.div`
  transition: all 1s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  border-bottom: 1px solid #f2ebeb;
  padding-bottom: 2rem;

  @media (max-width: 485px) {
    padding: 0 1rem;
    min-height: 5rem;
  }
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  & > div {
    line-height: 1.5rem;
  }

  & > h4 {
    margin: 0.5rem 0;
  }

  padding-top: 0.8rem;
`;
const Toggle = styled.div`
  & > button {
    text-decoration: underline;
  }

  img {
    width: 1.5rem;
    height: auto;
  }
  svg {
    width: 1.8rem;
    height: auto;
  }
`;
const Accordion = styled.div`
  line-height: 1.5rem;
  margin-bottom: 1rem;
  form {
    width: 50%;
    max-width: 25rem;

    .input-valid {
      transition: all 0.3s;
      height: 2rem;
      border-radius: 0.3rem;
      border: 1px solid #ebebeb;
      padding-left: 0.5rem;
      width: 100%;
      &.valid {
        box-shadow: 0 0 3px var(--primaryPurple);
      }
      &.not-valid {
        box-shadow: 0 0 5px var(--primaryPink);
      }
    }
    @media screen and (max-width: 590px) {
      width: 100%;
      max-width: none;
    }
  }

  label {
    color: #7a7777;
  }
`;

const Button = styled.button<{ isLoading: boolean }>`
  background-color: var(--mainColor);
  color: white;
  height: 2rem;
  border-radius: 0.3rem;
  padding: 0 1rem;
  font-weight: 550;
  position: relative;
  transition: all 0.3s;

  ${(props) =>
    props.isLoading === true &&
    css`
      span {
        visibility: hidden;
        opacity: 0.5;
        transition: all 0.2s;
      }

      &:active {
        background: #007a63;
      }
      &::after {
        content: "";
        position: absolute;
        width: 16px;
        height: 16px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border: 4px solid transparent;
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: button-loading-spinner 1s ease infinite;
      }
    `}

  @keyframes button-loading-spinner {
    from {
      transform: rotate(0turn);
    }

    to {
      transform: rotate(1turn);
    }
  }

  &:disabled {
    background-color: darkgray;
    &:hover {
      background-color: darkgray;
    }

    /*
   loading일 때 스피너 뜨게 하기
   
   */
  }
`;
const Nickname = styled(Accordion)`
  .updated-nickname {
    margin-bottom: 1rem;
  }
  label {
    margin-bottom: 1rem;
  }
  & button {
    /* margin-left: 1rem; */

    /* &:hover {
      box-shadow: 1px 3px 1px rgba(217, 220, 224, 0.901);
    } */
  }
`;
const ValidMsg = styled(ShowValid)`
  padding-left: 0;
  margin: 0.5rem 0;
  height: 1rem;

  @media screen and (max-width: 320px) {
    font-size: 0.7rem;
  }
`;
const Password = styled(Accordion)`
  margin-top: 0.5rem;

  & > input {
    margin: 0.2rem 0;
    height: 1.8rem;
  }

  & button {
    margin-top: 1rem;
    &:hover {
      box-shadow: 1px 3px 1px rgba(217, 220, 224, 0.901);
    }
  }

  & > span {
    margin-left: 1rem;
    color: red;
  }
`;
export {
  Wrapper,
  List,
  Info,
  Heading,
  Toggle,
  Accordion,
  Button,
  ValidMsg,
  Password,
  Nickname,
};
