import React from "react";
import styled from "styled-components";

const Container = styled.section<{ custom: string }>`
  height: 1.5rem;
  display: flex;
  align-items: center;
  display: flex;
  justify-content: space-evenly;
  width: 5.5rem;
  .count {
    width: 40%;
    text-align: center;
  }
  .max {
    width: 40%;
    text-align: end;
    color: gray;
  }

  ${(props) => props.custom}
`;

type CountTextProps = {
  content: string;
  maxContentLength: number;
  style?: string;
};

export default function CountText({
  content,
  maxContentLength,
  style,
}: CountTextProps) {
  return (
    <Container custom={style ? style : ""}>
      <span className="count">{content.length}</span>/
      <span className="max">{maxContentLength}</span>
    </Container>
  );
}
