import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
const Backdrop = styled.div<{ isHide: boolean }>`
  z-index: 100;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;

  animation-duration: 0.4s;
  animation-name: ${(props) => (props.isHide ? 'bright-soft' : 'dark-soft')};
  animation-fill-mode: forwards;
`;

const Container = styled.div<{ custom: string; isHide: boolean }>`
  z-index: 200;
  position: absolute;
  min-width: 19rem;
  max-width: 25rem;
  min-height: 20rem;
  max-height: 22rem;
  width: 40vw;
  height: 40vw;
  padding: 1rem;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 5px dimgrey;
  background-color: white;

  animation-name: ${(props) => (props.isHide ? 'slide-up' : 'slide-down')};
  animation-duration: 0.4s;
  animation-fill-mode: forwards;

  opacity: 1;
  transition: opacity 0.5s ease-out;
  ${(props) =>
    props.isHide &&
    css`
      opacity: 0;
    `}

  ${(props) => props.custom}
`;
type Props = {
  style?: { container: string; button?: string };
  children: React.ReactNode;
  hideStatus?: boolean;
};
export default function Modal({ style, children, hideStatus }: Props) {
  const [isHide, setIsHide] = useState(false);
  console.log(
    `rendering!, isHide : ${isHide}, props인 hideStatus : ${hideStatus}`
  );

  useEffect(() => {
    setIsHide(hideStatus!);
    return () => {};
  }, [hideStatus]);

  return (
    <Backdrop isHide={isHide}>
      <Container isHide={isHide} custom={style ? style?.container : ''}>
        {children}
      </Container>
    </Backdrop>
  );
}
