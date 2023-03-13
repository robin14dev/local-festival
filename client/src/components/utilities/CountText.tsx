import React from 'react';
import styled from 'styled-components';

const Container = styled.section`
  height: 1.5rem;
  display: flex;
  align-items: center;
  display: flex;
  justify-content: space-evenly;
  width: 5.5rem;
  /* margin-left: 1rem;
  margin-bottom: 0.5rem; */
  .count {
    width: 40%;
    text-align: center;
  }
  .max {
    width: 40%;
    text-align: end;
    color: gray;
  }
`;

type CountTextProps = {
  content: string;
  maxContentLength: number;
};

export default function CountText({
  content,
  maxContentLength,
}: CountTextProps) {
  return (
    <Container>
      <span className="count">{content.length}</span>/
      <span className="max">{maxContentLength}</span>
    </Container>
  );
}
