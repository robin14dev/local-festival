import React from 'react';
import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

export const ModalBackdrop = styled.div`
  z-index: 10;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContainer = styled.div<{
  custom?: { color: string; width: string; height: string };
  btnStyle?: { color: string; backGroundColor: string };
}>`
  z-index: 100;
  position: absolute;
  min-width: 19rem;
  max-width: 25rem;
  min-height: 20rem;
  max-height: 22rem;
  width: 40vw;
  height: 40vw;
  margin: 0 auto;
  background-color: white;
  border-radius: 0.8rem;
  padding: 1rem;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-evenly;
  color: ${({ custom }) => custom?.color};
  width: ${({ custom }) => custom?.width || '40vw'};
  height: ${({ custom }) => custom?.height};
  box-shadow: 0 1rem 1rem grey;
  div {
    display: flex;
    flex-flow: column;
    align-items: center;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 1.4rem;
    font-weight: 600;
  }

  h2 {
    font-size: 1rem;
    color: gray;
    margin-top: 0.3rem;
  }

  button {
    position: absolute;
    bottom: 2rem;
    color: ${({ btnStyle }) => btnStyle?.color || 'black'};
    background-color: ${({ btnStyle }) => btnStyle?.backGroundColor || 'white'};

    padding: 0.3rem;
    border-radius: 0.3rem;
    font-size: 1rem;
    width: 6rem;
    height: 2rem;
    box-shadow: 0 2px 5px var(--primaryPurple);
  }

  #count {
    color: gray;
    position: absolute;
    bottom: -0.5rem;
  }
`;

type ModalProps = {
  timer?: { time: number } | null;
  clickOption: { back: boolean };
  btnOption?: {
    text: string;
    style?: { color: string; backGroundColor: string };
  };
  containerStyle?: { color: string; width: string; height: string };
  children: JSX.Element[];
};
export default function Modal({
  clickOption,
  btnOption,
  containerStyle,
  timer,
  children,
}: ModalProps) {
  /*
  backdropOption을 클릭해도 모달이 사라지게 할것인지 아닌지
  modalBackdrop의 style
  modalContainerdml style
  modalContainer에 들어갈 요소 
  버튼 유무
  타이머 유무
  */

  const [isOpen, setIsOpen] = useState(true);
  const [count, setCount] = useState(timer ? timer.time / 1000 : 0);

  useEffect(() => {
    if (timer) {
      const countDown = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);

      let closeModal = setTimeout(() => {
        setIsOpen(false);
      }, timer.time);
      return () => {
        clearInterval(countDown);
        clearTimeout(closeModal);
      };
    } else {
      return;
    }
  }, []);
  return (
    <>
      {isOpen ? (
        <ModalBackdrop
          onClick={() => {
            clickOption.back && setIsOpen(false);
          }}
        >
          <ModalContainer custom={containerStyle} btnStyle={btnOption?.style}>
            {children}
            {btnOption && (
              <button onClick={() => setIsOpen(false)}>{btnOption.text}</button>
            )}
            <div id="count">{timer && count}</div>
          </ModalContainer>
        </ModalBackdrop>
      ) : null}
    </>
  );
}
