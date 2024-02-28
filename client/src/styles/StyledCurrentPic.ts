import styled from "styled-components";

export const Backdrop = styled.div`
  z-index: 10;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
`;

export const Modal = styled.div`
  background-color: white;
  margin: auto;
  width: 20rem;
  height: 21rem;
  border-radius: 3rem;
  padding: 1rem;
  display: flex;
  flex-flow: column;
  align-items: center;
  box-shadow: 0 1rem 1rem grey;

  justify-content: space-between;
  .header {
    width: 100%;
    height: 10%;
    button {
      width: 10%;
      height: 100%;
      svg {
        width: 100%;
        height: 100%;
      }
    }
  }

  .body {
    width: 40%;
    height: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
  }
  .isLoading {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      width: 105%;
      height: 105%;
      top: -7px;
      left: -6px;
      right: 0;
      bottom: 0;
      padding: 0.1rem;
      border: 2px solid transparent;
      border-top-color: var(--primaryBlue);
      border-radius: 50%;
      animation: button-loading-spinner 1.5s running infinite;
      filter: blur(0.4px);
    }
    @keyframes button-loading-spinner {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }
  }

  .img-container {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;

    img,
    svg {
      width: 100%;
      height: 100%;
    }
    &.picUrl {
      box-shadow: 1px 1px 6px lightgrey;
    }
  }

  .alert {
    /* display: flex;
    align-items: center;
    justify-content: center; */

    p {
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 500;

      &:nth-child(2) {
        padding-top: 0.2rem;
        color: gray;
        font-weight: 400;
      }
    }
    margin: 1rem 0;
  }
  .footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
    margin-bottom: 0.5rem;
    form {
      display: flex;
      width: 100%;
    }
    button {
      flex: 1;
      background-color: #f6f6f6e3;
      height: 2.8rem;
      color: var(--primaryBlue);
      font-size: 1rem;
      font-weight: 500;
      border-radius: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 1rem;
      transition: all 0.5s;

      &:hover:enabled {
        background-color: #efecece1;
      }
      &:disabled {
        filter: grayscale(1);
      }

      & + button {
        margin-left: 1rem;
      }
      svg {
        height: 50%;
        width: 40%;
        /* margin-right: 0.2rem; */
        /* background-color: yellow; */
        path {
          fill: var(--primaryPurple);
        }
      }
    }
    input {
      display: none;
    }
  }

  @media screen and (max-width: 370px) {
    width: 17rem;
    height: 18rem;
  }
`;
