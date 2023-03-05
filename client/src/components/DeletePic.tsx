import React, { useState, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { ReactComponent as Back } from '../assets/arrow-left.svg';
import { ReactComponent as Profile } from '../assets/profile-fill.svg';

import { UserContext } from '../contexts/userContext';

import { Backdrop as B, Modal as M } from '../styles/StyledCurrentPic';
const Backdrop = styled(B)``;
const Modal = styled(M)``;

type DeletePicProps = {
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  picUrl: string;
};

export const parsingUrl = (picUrl: string) => {
  return picUrl.split(`${process.env.REACT_APP_S3_GALLERY}/`)[1];
};

export default function DeletePic({
  picUrl,
  setIsOpen,
  setIsDelete,
}: DeletePicProps) {
  console.log('deletePic');

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const userContext = useContext(UserContext);

  const deletePic = async () => {
    const parsedUrl = parsingUrl(picUrl);
    try {
      setIsLoading(true);
      setProgress('');

      await axios({
        url: `${process.env.REACT_APP_SERVER_URL}/users/defaultPic`,
        method: 'delete',
        data: { urlKey: parsedUrl },
        headers: {
          accesstoken: sessionStorage.getItem('accesstoken') ?? '',
        },
      });

      userContext?.setAuthState((prevAuth) => ({
        ...prevAuth,
        defaultPic: '',
      }));
      sessionStorage.setItem(
        'user',
        JSON.stringify({
          ...userContext?.authState,
          defaultPic: '',
        })
      );
      setProgress('success');
    } catch (error) {
      setProgress('failure');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Backdrop>
      <Modal>
        <div className="header">
          <button onClick={() => setIsDelete(false)}>
            <Back />
          </button>
        </div>
        <div className={isLoading ? 'body isLoading' : 'body'}>
          <div className="img-container">
            <Profile />
          </div>
        </div>

        <section className="alert">
          {progress === 'success' && '프로필 사진이 업데이트 되었습니다'}
          {progress === 'failure' && (
            <>
              <p>서버와의 문제가 발생했습니다</p>{' '}
              <p>잠시후에 다시 시도해 주세요</p>
            </>
          )}
          {progress === '' && (
            <>
              <p>프로필 사진을 삭제하시겠습니까?</p>
              <p>기본 이미지로 변경됩니다</p>
            </>
          )}
        </section>
        <div className="footer">
          {progress === '' && (
            <>
              {' '}
              <button onClick={() => setIsDelete(false)}>취소</button>
              <button disabled={isLoading} onClick={deletePic}>
                삭제
              </button>
            </>
          )}
          {(progress === 'success' || progress === 'failure') && (
            <button onClick={() => setIsOpen(false)}>확인 </button>
          )}
        </div>
      </Modal>
    </Backdrop>
  );
}
