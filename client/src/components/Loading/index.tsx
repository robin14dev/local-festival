import React from "react";
import styled from "styled-components";
import loadMp4 from "../../assets/loading.mp4";

export const Wrapper = styled.article`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  video {
    width: 20%;
  }

  div {
    color: gray;
    font-size: 1.2rem;
  }
`;

type LoadingProps = {
  text: string;
};

const Loading = ({ text }: LoadingProps) => {
  return (
    <Wrapper>
      <video
        data-testid="loading-video"
        autoPlay
        loop
        muted
        playsInline
        width="100%"
        height="100%"
      >
        <source src={loadMp4} type="video/mp4" />
      </video>
      <div>{text}</div>.
    </Wrapper>
  );
};

export default Loading;
