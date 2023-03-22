import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

type Props = {
  message: { text: string; dismissTime: number; uuid: number };
};

const Wrapper = styled.div<{ isFading: boolean }>`
  animation: toast-in-right 0.6s;
  background: var(--primaryBlue);
  transition: 0.3s ease;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  color: #000;
  opacity: 0.9;
  font-weight: 600;

  color: #fff;
  padding: 0.5rem;
  margin: 10px;

  ${(props) =>
    props.isFading &&
    css`
      opacity: 0;
    `}

  @media screen and (max-width: 375px) {
    font-size: 0.9rem;
  }
`;

const Toast = ({ message }: Props) => {
  const [isFading, setIsFading] = useState(false);
  const { dismissTime, text } = message;
  useEffect(() => {
    let mounted = true;
    setTimeout(() => {
      if (mounted) {
        setIsFading(true);
      }
    }, dismissTime - 500);

    return () => {
      mounted = false;
    };
  }, []);

  return <Wrapper isFading={isFading}>{text}</Wrapper>;
};

export default Toast;
