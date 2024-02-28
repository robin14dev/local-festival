import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ServerFailModal from "./ServerFailModal";
import { mixin } from "../../styles/theme";

const Wrapper = styled.article`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(255 255 255 / 95%);
  overflow: auto;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  p {
    margin-bottom: 1rem;
    font-weight: 500;
  }

  button {
    padding: 0.5rem 1.4rem;
    color: var(--primaryOrange);
    border-radius: 0.7rem;
    font-weight: 500;
    font-size: 1rem;
    transition: all 0.3s;
    & + button {
      margin-left: 1rem;
    }
    &:hover {
      background-color: rgb(255 154 98 / 35%);
    }
  }

  .loading {
    position: relative;
    color: transparent;
    transition: all 0.2s;
    background-color: rgb(255 154 98 / 35%);
    &::after {
      ${mixin.spinner("4px solid antiquewhite", `var(--primaryOrange)`)}
    }
  }
`;

type ConfirmProps = {
  errorStatus: boolean;
  loadingStatus: boolean;
  text: { alert: string; cancel: string; confirm: string };
  cancelHandler: () => void;
  confirmHandler: () => void;
  onErrorFunc: () => void;
};

export default function Confirm({
  loadingStatus,
  errorStatus,
  onErrorFunc,
  text,
  cancelHandler,
  confirmHandler,
}: ConfirmProps) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(loadingStatus);
  const { alert, cancel, confirm } = text;
  const onClickCancel = () => {
    cancelHandler();
  };

  const onClickConfirm = () => {
    confirmHandler();
  };
  const onErrorHandler = () => {
    setIsError(false);
    onErrorFunc();
  };

  useEffect(() => {
    setIsError(errorStatus);
  }, [errorStatus]);

  useEffect(() => {
    setIsLoading(loadingStatus);
  }, [loadingStatus]);

  return (
    <>
      {isError && (
        <ServerFailModal confirmError={onErrorHandler}></ServerFailModal>
      )}
      <Wrapper>
        <p>{alert}</p>
        <div>
          <button onClick={onClickCancel}>{cancel}</button>
          <button
            className={isLoading ? "loading" : undefined}
            onClick={onClickConfirm}
          >
            {confirm}
          </button>
        </div>
      </Wrapper>
    </>
  );
}
