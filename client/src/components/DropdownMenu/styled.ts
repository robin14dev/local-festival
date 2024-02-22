import styled, { css } from "styled-components";

export const Ul = styled.ul`
  position: absolute;
  top: 4rem;
  right: 1rem;
  width: 8rem;
  box-shadow: 1px 1.5px 2px gray;
  background-color: white;
  border-radius: 0.2rem;
  overflow: hidden;
  z-index: 100;

  & li {
    list-style: none;
    line-height: 2.5rem;
    text-align: left;
    text-align: left;
    padding-left: 0.5rem;
    cursor: pointer;

    &:hover {
      background-color: whitesmoke;
    }
    &:active {
      background-color: white;
    }
  }
`;
export const Container = styled.div<{ isLogin: boolean; isPic: string }>`
  display: flex;
  height: 100%;
  z-index: 30;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 0.5rem;
  button {
    background-color: white;
    min-width: 4rem;
    min-height: 4rem;
    width: 100%;
    border-radius: 50%;
    height: 100%;
    padding: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    svg {
      height: 100%;
      width: fit-content;
      min-height: 1.5rem;
      color: var(--primaryPurple);
    }
  }

  ${({ isLogin, isPic }) =>
    (isLogin === false || (isLogin && !isPic)) &&
    css`
      background-color: transparent;
      height: 100%;

      button {
        height: 100%;
        background-color: transparent;

        svg {
          color: white;
        }
      }
    `}

  @media (max-width: 840px) {
    right: 2rem;
  }
  @media (max-width: 600px) {
    right: 1rem;
  }
  @media (max-width: 500px) {
    right: 0.1rem;
  }

  @media (max-width: 475px) {
    display: none;
  }
`;
