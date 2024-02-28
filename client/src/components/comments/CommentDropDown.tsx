import React from "react";
import Dropdown from "../utilities/Dropdown";
import { ReactComponent as Edit } from "../../assets/edit.svg";
import { ReactComponent as Delete } from "../../assets/delete.svg";
type Props = {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDrop: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CommentDropDown({
  setIsEdit,
  setIsDrop,
  setIsDelete,
}: Props) {
  return (
    <Dropdown>
      <li
        onClick={() => {
          setIsEdit(true);
          setIsDrop(false);
        }}
      >
        <Edit />
        수정하기
      </li>
      <li
        onClick={() => {
          setIsDelete(true);
          setIsDrop(false);
        }}
      >
        <Delete />
        삭제하기
      </li>
    </Dropdown>
  );
}
