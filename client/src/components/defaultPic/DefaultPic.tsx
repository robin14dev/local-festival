import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/userContext';

import styled from 'styled-components';

import { ReactComponent as CameraRound } from '../../assets/camera-round.svg';
import { ReactComponent as Profile } from '../../assets/profile-fill.svg';

import CurrentPic from './CurrentPic';

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
    &::after {
      content: '';
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
      &:hover {
        background-color: #efecece1;
      }

      & + button {
        margin-left: 1rem;
      }
      svg {
        height: 50%;
        width: 40%;
        path {
          fill: var(--primaryPurple);
        }
      }
    }
    input {
      display: none;
    }
  }
`;

const Container = styled.section`
  margin-bottom: 1rem;
  position: relative;
  .img-container {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    overflow: hidden;
    left: -0.5rem;
    cursor: pointer;

    svg,
    img {
      width: 100%;
      height: 100%;
      position: relative;

      & + svg {
        position: absolute;
        width: 1.7rem;
        height: 30%;
        bottom: 0;
        left: 3.5rem;
      }
    }
  }

  input {
    display: none;
  }

  @media (max-width: 485px) {
    .img-container {
      left: 1rem;
    }
  }
`;
type DefaultPicProps = {
  initialUrl: string;
};

function DefaultPic({ initialUrl }: DefaultPicProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [picUrl, setPicUrl] = useState(initialUrl);
  const userContext = useContext(UserContext);
  useEffect(() => {
    setPicUrl(initialUrl);
  }, [initialUrl]);

  const imgOnError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
    userContext?.setAuthState((prevState) => ({
      ...prevState,
      defaultPic: '',
    }));
  };
  return (
    <>
      {isOpen && (
        <CurrentPic
          picUrl={picUrl}
          setPicUrl={setPicUrl}
          setIsOpen={setIsOpen}
        />
      )}
      <Container>
        <div
          className="img-container"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {picUrl ? (
            <img onError={imgOnError} src={picUrl} alt={`프로필 사진`}></img>
          ) : (
            <Profile />
          )}
          <CameraRound />
        </div>
      </Container>
    </>
  );
}

export default DefaultPic;
