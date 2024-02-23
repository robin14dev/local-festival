import styled from "styled-components";
import { Wrapper as W } from "../../components/Loading";

export const LoadingWrapper = styled(W)`
  margin-top: 50vh;
`;

export const Wrapper = styled.main`
  flex: 1 1 auto;
  width: 81rem;
  max-width: 1296px;
  margin: 5rem auto 0 auto;
  padding: 0 8rem;
  display: flex;
  flex-direction: column;
  overflow: visible;
  justify-content: space-evenly;
  align-items: center;

  .figAndSummary {
    width: 100%;
    display: flex;
    flex: 1 1 auto;
    justify-content: space-between;
    background-color: white;
    padding: 0 1rem;

    @media (max-width: 485px) {
      flex-direction: column;
    }
  }

  figure {
    background-color: white;
    flex: 1 1 0;
    width: 378px;
    max-width: 383px;
    margin-top: 5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    aspect-ratio: 383/502;
    border-radius: 18px;
    box-shadow: 1px 0px 7px rgb(0 0 0 / 22%);
    & > img {
      width: 100%;
      max-width: 100%;
      height: 80%;
      border-radius: 1rem;
      padding: 0.5rem;
    }

    figcaption {
      width: 100%;
      margin-top: 0.2rem;
      display: flex;
      justify-content: space-between;
      padding: 0 1rem;

      div {
        display: flex;
        align-items: center;
      }
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.1rem;
        margin-right: 0.5rem;
        color: gray;
        img,
        svg {
          width: 25px;
          height: auto;
          margin-right: 0.2rem;
        }
      }
    }

    @media (max-width: 485px) {
      padding: 0;
      width: auto;
      height: 260px;
      border-radius: 0;
      box-shadow: none;

      & > img {
        padding: 0;
        border-radius: 0;
        object-fit: contain;
        height: 100%;
      }

      button {
        display: none;
      }
    }
  }

  .summary {
    flex: 1 1 0;
    max-width: 526px;
    margin-top: 5rem;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    h1 {
      font-weight: 700;
      font-size: 2rem;
      line-height: 42px;
    }

    ul {
      margin-bottom: 52px;
    }

    li {
      font-weight: 500;
      font-size: 22px;
      line-height: 27px;
      max-width: 400px;
      color: #a0a0a0;
    }

    .reviews {
      background-color: white;
      flex: 0 1 auto;
      padding: 0.4rem;

      width: 100%;
      min-height: 7rem;
      border: 1px solid #d9d9d9;
      border-radius: 7px;
      .header {
        color: var(--mainColor);
        font-weight: 700;
        display: flex;
        align-items: center;

        span {
          padding-right: 0.5rem;
          &:nth-child(3) {
            padding-left: 1rem;
          }
        }
      }
      p {
        line-height: 1.2;
        word-break: break-all;
      }
      .noReview {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #a0a0a0;
      }
    }
    div + div {
      margin-top: 14px;
    }
    @media screen and (max-width: 870px) {
      h1 {
        font-size: 1.5rem;
      }

      ul {
        margin-bottom: 0.5rem;
        li {
          font-size: 1.1rem;
        }
      }
    }

    @media (max-width: 485px) {
      display: none;
      width: 300px;
      & > div {
        display: none;
      }
    }
  }

  @media (max-width: 1296px) {
    width: 100vw;
    .figAndSummary {
      width: 1040px;
    }
  }
  @media (max-width: 1076px) {
    .figAndSummary {
      width: 100vw;
    }
    .summary {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const Tab = styled.section`
  width: 65rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (max-width: 1076px) {
    width: 100vw;
  }

  @media (max-width: 485px) {
    display: none;
  }
`;

export const Menu = styled.nav`
  margin-top: 31px;
  color: rgba(73, 73, 73, 0.5);
  font-weight: bold;
  font-size: 1.5rem;
  display: flex;
  justify-items: center;
  align-items: center;
  list-style: none;
  border-bottom: 1px solid #d9d9d9;
  & > div {
    width: 100%;
  }

  a {
    text-decoration: none;
    width: 115px;
    text-align: center;
    color: #acacac;
    font-size: 22px;
    line-height: 49px;
    font-weight: 600;
  }

  & div.desc {
    text-align: center;
  }

  @media (max-width: 485px) {
    display: none;
  }
`;

export const MobileWrapper = styled.main`
  padding-top: 5rem;
  display: none;
  @media (max-width: 768px) {
    display: block;
  }

  .nav {
    display: flex;
    justify-content: space-between;
    height: 80px;
    position: fixed;
    top: 0;
    z-index: 20;
    background-color: white;
    width: 100vw;
    padding: 1rem;
    box-shadow: 0px 1px 4px lightgrey;
    img {
      height: 34px;
    }

    div {
      display: flex;
      align-items: center;
      img {
        height: 24px;
        margin-left: 1.1rem;
      }
    }
  }

  & > img {
    width: 100%;
    height: 40vh;
    object-fit: contain;
  }

  .header {
    padding-bottom: 4px;
    border-bottom: 1px solid #d9d9d9;
    width: 95%;
    margin: 0 auto;

    h2 {
      margin-left: 0;
    }
  }
  h1 {
    font-weight: 700;
    font-size: 22px;
    margin-top: 17px;
    margin-bottom: 21px;
    margin-left: 9px;
  }

  h3 {
    font-weight: 400;
    font-size: 16px;

    color: #a0a0a0;
    margin-left: 18px;
  }

  .likeINfo {
    margin-top: 1rem;
    height: 37px;
    color: #a0a0a0;

    display: flex;
    div {
      padding-left: 11px;
      display: flex;
      align-items: center;

      svg {
        margin-right: 0.5rem;
      }
    }
  }

  h2 {
    font-weight: 600;
    font-size: 20px;
    margin-left: 14px;
    margin-top: 40px;
  }

  .description {
    padding: 18px;
    line-height: 1.5;
  }

  .infoList {
    padding: 17px;
    li {
      font-weight: 700;
      font-size: 16px;
      line-height: 26px;
      display: flex;
      & > div {
        width: 60px;
        @media screen and (max-width: 375px) {
          font-size: 0.8rem;
        }
        & + div {
          width: 260px;
          padding-left: 1rem;
          font-weight: 400;
        }
      }

      button {
        display: flex;
        align-items: center;
        line-height: 1;

        svg {
          height: 100%;
          margin-right: 0.3rem;
        }
      }
    }
  }
  padding-bottom: 5rem;
`;
