import React from "react";
import peachmong from "../assets/peachmong.png";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 5rem;
  position: fixed;
  bottom: 0;
  display: flex;
  border-top: 1px solid lightgray;
  justify-content: flex-start;
  background-color: #f1f3f5;
  color: black;
  /* margin-top: 2rem; */
  padding: 0.5rem;
  /* box-shadow: 0 -2px 0 1px #f0f1f4; */
  & > img { 
    width: 4rem;
    height: 4rem;
    margin-left: 1rem;
  }
 
`;

const Footer = () => {
  return (
    <Wrapper>
      <img src={peachmong} alt="peachmong" />
      <div>Copyright © 2022 Peachmong All rights reserved.</div>
    </Wrapper>
  );
};

export default Footer;
