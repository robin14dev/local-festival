import styled from "styled-components";

export const Backdrop = styled.div`
  z-index: 20;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);

  animation-duration: 0.4s;

  animation-fill-mode: forwards;
`;

export const Container = styled.div`
  z-index: 100;
  position: fixed;
  width: 400px;
  height: 460px;
  display: flex;
  flex-direction: column;

  text-align: center;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  margin-top: -256px;
  margin-left: -200px;
  left: 50%;
  top: 50%;

  animation-duration: 0.4s;

  animation-fill-mode: forwards;

  & > h1 {
    margin: 2rem 0;
    font-size: 3rem;
    cursor: pointer;
    font-style: italic;
    font-family: "HS-Regular";
    color: var(--mainColor);
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem 0;
    input {
      border-radius: 6px;
      border: 1.8px solid #b1aeae;
      padding: 0.5rem;
      width: 80%;
      height: 3rem;
      font-family: "NanumSquareRound";
      &::placeholder {
        opacity: 0.5;
      }
    }
    div {
      min-height: 1rem;
      color: red;
      font-size: 0.8rem;
      align-self: flex-start;
      margin-left: 3rem;
      margin-bottom: 1rem;
      padding-top: 0.2rem;
    }
    button {
      width: 80%;
      height: 3rem;
      margin-top: 1rem;
      font-size: 1rem;

      color: #fff;
      font-family: "NanumSquareRound";
      font-weight: bold;
      background: var(--mainColor);
      border-radius: 6px;
      cursor: pointer;
      transition : all 0.7s;
      &:hover {
        filter : brightness(1.15)
      }
      &:disabled {
        filter : brightness(0.8);
       
      }
    }
  }

  .footer {
    display: flex;
    /* background-color: yellow; */
    justify-content: center;
    align-items: center;
    font-size: 0.9rem;
    font-weight: 500;

    button {
      font-family: "NanumSquareRound";
      margin-left: 1rem;
      font-size: 1rem;
      /* background-color: yellowgreen; */
      color: var(--primaryPurple);
      font-weight: bold;
      padding-bottom: 3px;
      transition: all 0.2s;
      &:hover {
        color: var(--primaryOrange);
        border-radius: 5px;
      }
    }
  }

  p {
    color: red;
  }

  .modalClose {
    display: none;
  }

  @media screen and (max-width: 428px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
    margin: 0;
    left: 0;
    top: 0;

    .modalClose {
      display: block;
      margin-top: 2rem;
      color: gray;
      font-family: "NanumSquareRound";
    }
  }
`;
// export const Container = styled.div<{ isHide: boolean }>`
//   z-index: 100;
//   position: fixed;
//   width: 400px;
//   height: 460px;
//   display: flex;
//   flex-direction: column;

//   text-align: center;
//   background: #fff;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
//   border-radius: 10px;
//   margin-top: -256px;
//   margin-left: -200px;
//   left: 50%;
//   top: 50%;

//   animation-duration: 0.4s;
//   animation-name: ${(props) => (props.isHide ? "slide-up" : "slide-down")};
//   animation-fill-mode: forwards;

//   & > h1 {
//     margin: 2rem 0;
//     font-size: 3rem;
//     cursor: pointer;
//     font-style: italic;
//     font-family: "HS-Regular";
//     color: var(--mainColor);
//   }

//   form {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     margin: 2rem 0;
//     input {
//       border-radius: 6px;
//       border: 1.8px solid #b1aeae;
//       padding: 0.5rem;
//       width: 80%;
//       height: 3rem;
//       font-family: "NanumSquareRound";
//       &::placeholder {
//         opacity: 0.5;
//       }
//     }
//     div {
//       min-height: 1rem;
//       color: red;
//       font-size: 0.8rem;
//       align-self: flex-start;
//       margin-left: 3rem;
//       margin-bottom: 1rem;
//       padding-top: 0.2rem;
//     }
//     button {
//       width: 80%;
//       height: 3rem;
//       margin-top: 1rem;
//       font-size: 1rem;

//       color: #fff;
//       font-family: "NanumSquareRound";
//       font-weight: bold;
//       background: var(--mainColor);
//       border-radius: 6px;
//       cursor: pointer;
//     }
//   }

//   .footer {
//     display: flex;
//     /* background-color: yellow; */
//     justify-content: center;
//     align-items: center;
//     font-size: 0.9rem;
//     font-weight: 500;

//     button {
//       font-family: "NanumSquareRound";
//       margin-left: 1rem;
//       font-size: 1rem;
//       /* background-color: yellowgreen; */
//       color: var(--primaryPurple);
//       font-weight: bold;
//       padding-bottom: 3px;
//       transition: all 0.2s;
//       &:hover {
//         color: var(--primaryOrange);
//         border-radius: 5px;
//       }
//     }
//   }

//   p {
//     color: red;
//   }

//   .modalClose {
//     display: none;
//   }

//   @media screen and (max-width: 428px) {
//     width: 100%;
//     height: 100%;
//     border-radius: 0;
//     margin: 0;
//     left: 0;
//     top: 0;

//     .modalClose {
//       display: block;
//       margin-top: 2rem;
//       color: gray;
//       font-family: "NanumSquareRound";
//     }
//   }
// `;
