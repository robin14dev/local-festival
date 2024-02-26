import styled from "styled-components";

export const Container = styled.footer`
  z-index: 10;
  width: 100%;
  height: 3rem;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  border-top: 1px solid lightgray;
  justify-content: flex-start;
  background-color: #f1f3f5;
  color: black;
  padding: 0.5rem;
  img {
    width: 2rem;
    height: 2rem;
    margin-left: 1rem;
  }
  div {
    padding-left: 1rem;
    font-size: 0.7rem;
  }

  @media (max-width: 476px) {
    display: none;
  }
`;

export const MobileContainer = styled.footer`
  background-color: white;
  position: fixed;
  bottom: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  padding: 0 3rem;
  height: 4rem;
  width: 100%;
  @media (min-width: 476px) {
    display: none;
  }
`;

export const Item = styled.div`
  cursor: pointer;
  width: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    height: 1.5rem;
    width: 1.5rem;
  }
  div {
    font-weight: 400;
    font-size: 12px;
  }
`;
