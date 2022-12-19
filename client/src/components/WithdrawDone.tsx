import React from 'react';
import styled from 'styled-components';

const ModalBackdrop = styled.div`
  position: fixed;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalView = styled.div`
  position: fixed;
  z-index: 100;
  width: 30rem;
  margin: 10rem auto;
  height: 20rem;
  left: 0;
  right: 0;

  border-radius: 10px;
  background-color: #ffffff;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > h2 {
    position: relative;
    top: -1rem;
  }

  & > button {
    height: 2rem;
    width: 6.5rem;
    position: relative;
    top: 1rem;
    background-color: var(--mainColor);
    color: white;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
    transition: transform 0.2s ease-out;
    &:hover {
      transition: transform 0.2s ease-out;
      transform: translateY(-5%);
    }
  }
`;

const WithdrawDone = ({
  setFinishModal,
}: {
  setFinishModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <ModalBackdrop
        onClick={() => {
          setFinishModal(false);
        }}
      />
      <ModalView
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h2>성공적으로 계정 삭제가 완료 되었습니다</h2>
        <h2>이용해주셔서 감사합니다</h2>

        <button
          className="close-btn"
          onClick={() => {
            window.sessionStorage.clear();
            window.location.replace('/');
          }}
        >
          확인
        </button>
      </ModalView>
    </>
  );
};

export default WithdrawDone;
