import styled, { css } from "styled-components";

export const Container = styled.div`
  height: 3rem;
  width: 100vw;
  background-color: white;
  position: fixed;
  top: 9rem;
  display: flex;
  justify-content: center;

  @media (max-width: 1210px) {
    width: 100vw;
  }
  @media (max-width: 1010px) {
    width: 100vw;
  }
  @media (max-width: 675px) {
    width: 100vw;
  }
  @media (max-width: 475px) {
    display: none;
  }
`;

export const Button = styled.button<{ active: boolean }>`
  width: max-content;
  height: 38px;
  padding: 0.1rem 0.5rem;
  background: #f5f6fa;
  color: black;
  border-radius: 9px;
  margin-left: 1rem;
  font-size: 1rem;
  transition: all 0.1s ease-in;

  :hover {
    background-color: #6268ff;
    color: white;
  }

  ${(props) =>
    props.active &&
    css`
      background-color: #6268ff;
      color: white;
    `}
`;
