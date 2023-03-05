import React, { useState, useContext } from 'react';
import axios, { AxiosResponse } from 'axios';
import styled from 'styled-components';
import { Backdrop as B, Modal as M } from '../styles/StyledCurrentPic';
import { UserContext } from '../contexts/userContext';
import { ReactComponent as Back } from '../assets/arrow-left.svg';
import { parsingUrl } from './DeletePic';

const Backdrop = styled(B)``;
const Modal = styled(M)``;

type PreviewPicProps = {
  picUrl: string;
  preview: FormData;
  setPicUrl: React.Dispatch<React.SetStateAction<string>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPreview: React.Dispatch<React.SetStateAction<FormData | undefined>>;
};
export default function PreviewPic({
  preview,
  setIsOpen,
  setPreview,
  picUrl,
}: PreviewPicProps) {
  /*
  picUrl이 있으면 업데이트, 없으면 새로 생성
  
  */
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const userContext = useContext(UserContext);

  const submitPic = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setProgress('');
      let result: AxiosResponse;
      if (!picUrl) {
        // create

        result = await axios({
          url: `${process.env.REACT_APP_SERVER_URL}/users/defaultPic`,
          method: 'post',
          data: preview,
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken') ?? '',
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // update

        const parsedUrl = parsingUrl(picUrl);

        // s3  delete 먼저
        await axios({
          url: `${process.env.REACT_APP_SERVER_URL}/users/defaultPic`,
          method: 'delete',
          data: { urlKey: parsedUrl },
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken') ?? '',
          },
        });

        // s3 post
        result = await axios({
          url: `${process.env.REACT_APP_SERVER_URL}/users/defaultPic`,
          method: 'post',
          data: preview,
          headers: {
            accesstoken: sessionStorage.getItem('accesstoken') ?? '',
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      userContext?.setAuthState((prevAuth) => ({
        ...prevAuth,
        defaultPic: result.data.url,
      }));
      sessionStorage.setItem(
        'user',
        JSON.stringify({
          ...userContext?.authState,
          defaultPic: result.data.url,
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
          <button onClick={() => setPreview((prev) => undefined)}>
            <Back />
          </button>
        </div>
        <div className={isLoading ? 'body isLoading' : 'body'}>
          <div className={preview ? 'img-container picUrl' : 'img-container'}>
            {preview && (
              <img src={preview.get('url') as string} alt="미리보기" />
            )}
          </div>
        </div>
        <section className="alert">
          {progress === 'success' && '프로필 사진이 업데이트 되었습니다'}
          {progress === 'failure' && (
            <>
              <p>서버와의 문제가 발생했습니다</p>
              <p>잠시후에 다시 시도해 주세요</p>
            </>
          )}
          {progress === '' && '위 사진으로 등록하시겠습니까?'}
        </section>

        <div className="footer">
          {progress === '' && (
            <form encType="multipart/form-data">
              <button disabled={isLoading} onClick={submitPic}>
                등록
              </button>
            </form>
          )}

          {(progress === 'success' || progress === 'failure') && (
            <button onClick={() => setIsOpen(false)}>확인 </button>
          )}
        </div>
      </Modal>
    </Backdrop>
  );
}
