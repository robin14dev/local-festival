import React from 'react';
import { ReactNode } from 'react';
import styled from 'styled-components';

const Container = styled.ul`
  transition: transform 0.6s ease-in-out;
  transition: 0.3s ease;
  animation: toast-in-right 0.6s;

  @keyframes toast-in-right {
    from {
      transform: translateX(20%);
    }
    to {
      transform: translateX(0);
    }
  }
  width: 8rem;
  height: 5rem;
  position: absolute;
  right: 3rem;
  top: 1rem;
  line-height: 1.4;
  box-shadow: 1.5px 1.5px 3px lightgrey;
  border: 1px solid #d3d3d345;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  z-index: 10;

  li {
    display: flex;
    align-items: center;
    height: 50%;
    padding: 0 0.5rem;
    cursor: pointer;
    &:hover {
      background-color: #f4f4f4;
    }
    &:active {
      background-color: white;
    }
    svg {
      margin-right: 1.8rem;
    }
  }
`;

type Props = { children: ReactNode };

const Dropdown = ({ children }: Props) => {
  return <Container>{children}</Container>;
};

export default Dropdown;
