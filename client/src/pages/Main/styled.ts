import styled from "styled-components";
import Loading, { Wrapper as W } from "../../components/Loading";

export const Container = styled.div`
  margin: 0 auto 5rem auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 475px) {
    margin-bottom: 4rem;
  }
`;

export const SearchAndTag = styled.div`
  width: 100vw;
  height: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 5rem;
  z-index: 1;
  background-color: white;
  @media (max-width: 475px) {
    background-color: var(--mainColor);
    padding: 0;
  }
`;

export const FestivalList = styled.section`
  width: 88%;
  margin-top: 12rem;
  padding-bottom: 5rem;

  display: flex;
  flex-wrap: wrap;
  @media (max-width: 1210px) {
    width: 90vw;
  }

  @media screen and (max-width: 485px) {
    margin-top: 10rem;
    padding-bottom: 0;
  }
`;

export const LoadingWrapper = styled(W)``;

export const ErrorMsg = styled.section`
  margin: 0 auto;
  max-width: 40rem;
  padding-top: 92px;
  display: flex;
  justify-content: space-between;
  svg {
    width: 50%;
    height: 100%;
  }
  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  h1 {
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    font-size: 2rem;
    line-height: 48px;

    color: #6268ff;
  }

  p {
    font-family: "Inter";
    font-style: normal;
    font-weight: 600;
    font-size: 1.2rem;
    line-height: 29px;

    span {
      color: #ff9a62;
    }
  }
  @media screen and (max-width: 485px) {
    width: 100%;
    flex-direction: column;
    padding: 0;

    svg {
      margin: 0 auto;
    }
    h1 {
      font-size: 1.5rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;
