import React, { useState, useRef } from "react";

import styled from "styled-components";
import { Backdrop as B, Modal as M } from "../../../styles/StyledCurrentPic";

import { ReactComponent as CameraFill } from "../../../assets/camera-fill.svg";
import { ReactComponent as Profile } from "../../../assets/profile-fill.svg";
import { ReactComponent as Delete } from "../../../assets/delete.svg";
import { ReactComponent as Escape } from "../../../assets/escape.svg";

import DeletePic from "./DeletePic";
import PreviewPic from "./PreviewPic";
const Backdrop = styled(B)``;
const Modal = styled(M)``;

type CurrentPicProps = {
  picUrl: string;
  setPicUrl: React.Dispatch<React.SetStateAction<string>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function CurrentPic({ picUrl, setIsOpen, setPicUrl }: CurrentPicProps) {
  const [preview, setPreview] = useState<FormData | undefined>();
  const [isDelete, setIsDelete] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files?.length === 1) {
      const formData = new FormData();
      formData.set("file", e.target.files[0]);

      fileReader.readAsDataURL(e.target.files[0]);
      fileReader.onload = function (e) {
        if (typeof e.target?.result === "string") {
          formData.append("url", e.target.result);
          setPreview(formData);
        }
      };
    }
  };

  if (isDelete) {
    return (
      <DeletePic
        picUrl={picUrl}
        setIsDelete={setIsDelete}
        setIsOpen={setIsOpen}
      />
    );
  }

  if (preview) {
    return (
      <PreviewPic
        picUrl={picUrl}
        preview={preview}
        setPreview={setPreview}
        setPicUrl={setPicUrl}
        setIsOpen={setIsOpen}
      />
    );
  }

  return (
    <Backdrop>
      <Modal>
        <div className="header">
          <button
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <Escape />
          </button>
        </div>
        <div className="body">
          <div className={picUrl ? "img-container picUrl" : "img-container"}>
            {picUrl ? <img src={picUrl} alt="프로필 사진" /> : <Profile />}
          </div>
        </div>
        <div className="footer">
          <button
            onClick={() => {
              inputRef.current?.click();
              console.log("click!!", inputRef.current);
            }}
          >
            <CameraFill />
            변경
          </button>
          <button disabled={!picUrl} onClick={() => setIsDelete(true)}>
            <Delete />
            삭제
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onChangeHandler}
          />
        </div>
      </Modal>
    </Backdrop>
  );
}

export default CurrentPic;
