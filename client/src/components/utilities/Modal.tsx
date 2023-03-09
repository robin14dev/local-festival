import React from 'react';
import styled from 'styled-components';
const Backdrop = styled.div`
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
`;

const Container = styled.div<{ custom: string }>`
  z-index: 200;
  position: absolute;
  min-width: 19rem;
  max-width: 25rem;
  min-height: 20rem;
  max-height: 22rem;
  width: 40vw;
  height: 40vw;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;

  ${(props) => props.custom}
`;
type Props = {
  style: { container: string };
  children: React.ReactNode;
};
export default function Modal({ style, children }: Props) {
  const { container } = style;

  return (
    <Backdrop>
      <Container custom={container}>{children}</Container>
    </Backdrop>
  );
}
