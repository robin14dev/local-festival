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
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;
export const Links = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;
export const Link = styled.a`
  font-size: 1rem;
  display: flex;
  align-items: center;
  color: gray;

  & + a {
    margin-left: 1rem;
  }

  & > svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  & > span {
    margin-left: 0.25rem;
  }
`;
