import styled from "styled-components";

export const Form = styled.form`
  width: 90%;
  max-width: 476px;
  height: 43px;
  margin-top: 0.5rem;
  background: white;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: 0 0.1rem 0.3rem 0.01rem lightgray;
  border-radius: 0.7rem;
  position: fixed;
  top: 5rem;

  input {
    width: 100%;
    height: 60%;
    border: none;
    font-size: 1rem;
    border-radius: 0.2rem;
    padding-left: 0.5rem;
    margin-left: 0.5rem;
    background: white;
  }
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    background-image: none;
    font-size: large;
    font-weight: bold;
    border-radius: 0.2rem;

    img {
      height: 50%;
      width: 50%;
    }
  }

  @media (max-width: 475px) {
    border-radius: 9px;
    height: 43px;
    box-shadow: none;

    input::placeholder {
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 16px;
      color: #978d8d;
    }
  }
`;
