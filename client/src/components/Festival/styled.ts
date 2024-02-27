import styled from "styled-components";

export const Container = styled.article`
  width: 25%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  & > img {
    max-width: 100%;
    aspect-ratio: 1/1;
    border-radius: 10px;
  }
  section {
    display: flex;
    justify-content: space-between;
    padding: 0 0.5rem;

    div {
      width: 85%;
    }

    h1 {
      font-weight: 600;
      font-size: 14px;
      line-height: 17px;
      margin: 0.4rem 0 0.18rem 0;
    }

    li {
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      color: #797979;
    }

    h1,
    li {
      white-space: nowrap;
      overflow: hidden;
      width: 11rem;
      text-overflow: ellipsis;
    }
  }

  button {
    /* background-color: white; */
  }

  button > img {
    height: 1.5rem;
    width: auto;
  }

  transition: transform 0.3s ease-out;

  &:hover {
    transform: scale(1.03);
  }

  @media screen and (max-width: 1100px) {
    width: 33%;
  }
  @media screen and (max-width: 923px) {
    width: 50%;
  }
  @media screen and (max-width: 521px) {
    width: 100%;
  }
  @media (max-width: 485px) {
    padding: 1rem 0;
    &:hover {
      transform: none;
    }

    section {
      h1,
      li {
        width: 100%;
      }
    }
  }
`;

export const Status = styled.div<{ status: string }>`
  position: absolute;
  width: 52px;
  height: 26px;
  border-radius: 0.5rem 0.1rem 0.4rem 0.1rem;

  background-color: ${({ status }) =>
    status === "scheduled"
      ? `var(--primaryBlue)`
      : status === "completed"
        ? "#4e4d4d"
        : `var(--primaryOrange)`};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;
