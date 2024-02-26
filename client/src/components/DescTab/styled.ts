import styled from "styled-components";

export const Container = styled.section`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  border-radius: 0 0 1rem 1rem;
  padding: 1rem;
  padding-bottom: 5rem;

  h1 {
    font-size: 2rem;
    margin-top: 42px;
    margin-bottom: 21px;
  }
  h2 {
    color: #878585;

    font-weight: 600;
    font-size: 22px;
    line-height: 27px;
  }

  h2 + h2 {
    margin-top: 11px;
  }

  h3 {
    color: #878585;
    img {
      height: 22px;
      margin-right: 22px;
    }
  }

  @media (max-width: 485px) {
    display: none;
  }
`;
export const Overview = styled.p`
  margin-top: 43px;
  margin-bottom: 21px;
  line-height: 1.5;
  word-break: "keep-all";
  text-indent: "0.5rem";
  white-space: "pre-line";
`;
export const Contacts = styled.div`
  svg {
    height: 100%;
    width: auto;
    margin-right: 0.5rem;
  }
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 1rem;

    color: #878585;
  }
  button + button {
    margin-left: 1rem;
  }
  div {
    height: 1.8rem;
  }
`;
export const Links = styled.div`
  display: flex;
  margin-top: 1.5rem;
`;
