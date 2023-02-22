import React from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import { ReactComponent as Camera } from '../assets/camera.svg';
import { ReactComponent as Profile } from '../assets/profile-fill.svg';
const Container = styled.section`
  margin-bottom: 1rem;
  /* background-color: yellow; */
  .img-container {
    /* background-color: yellowgreen; */
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    position: relative;
    left: -0.5rem;
    cursor: pointer;

    svg {
      width: 100%;
      height: 100%;

      & + svg {
        position: absolute;
        width: 30%;
        height: 30%;
        bottom: 0;
        right: 0.1rem;
      }
    }
  }
  img {
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

type Props = {};

function DefaultPic({}: Props) {
  let imgUrl = false;
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Container>
      <div
        className="img-container"
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        {imgUrl ? (
          <img src={Profile} alt={`이미지가 존재하지 않습니다`}></img>
        ) : (
          <Profile />
        )}
        <Camera />
      </div>
      <input ref={inputRef} type="file"></input>
    </Container>
  );
}

export default DefaultPic;
