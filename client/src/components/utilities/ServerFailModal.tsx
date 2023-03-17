import React from 'react';
import Modal from '../utilities/Modal';
import { ReactComponent as Failure } from '../../assets/server-fail.svg';
import styled from 'styled-components';

const Content = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-between;

  svg {
    margin-top: 2rem;
  }

  div {
    display: flex;
    flex-flow: column;
    align-items: center;
    margin-top: 2rem;
    font-weight: 600;
    font-size: 1.1rem;
    p + p {
      font-weight: 500;
      margin-top: 0.3rem;
      margin-bottom: 1rem;
    }
  }

  button {
    width: 100%;
    background-color: var(--primaryPurple);
    padding: 0.8rem 0;
    color: white;
    border-radius: 0.8rem;
    font-size: 1rem;
    font-weight: 600;
  }
`;

const customStyle = {
  container: `
  border-radius: 2rem 2rem 1.8rem 1.8rem;
  box-shadow: 0 3px 11px #3b3b3b;
  max-width:18rem;
  height:10rem;
  `,
};

type ServerFailProps = {
  confirmError: () => void;
};

export default function ServerFailModal({ confirmError }: ServerFailProps) {
  const onClickHandler = () => {
    confirmError();
  };

  return (
    <Modal style={customStyle}>
      <Content>
        <Failure />
        <div>
          <p>서버와의 연결이 끊어졌습니다</p>
          <p>잠시후에 다시 시도해 주세요</p>
        </div>
        <button onClick={onClickHandler}>확인</button>
      </Content>
    </Modal>
  );
}
