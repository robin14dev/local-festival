import React from 'react';
import Dropdown from '../utilities/Dropdown';
import { ReactComponent as Edit } from '../../assets/edit.svg';
import { ReactComponent as Delete } from '../../assets/delete.svg';
type ReviewDropdownProps = {
  // setEditItem: React.Dispatch<React.SetStateAction<EditItem>>;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  info: TReviewItem;
};

export default function ReviewDropdown({
  setIsEdit,
  setIsDelete,
  info,
}: ReviewDropdownProps) {
  return (
    <Dropdown>
      <li onClick={() => setIsEdit(true)}>
        <Edit /> 수정하기
      </li>
      <li onClick={() => setIsDelete(true)}>
        <Delete />
        삭제하기
      </li>
    </Dropdown>
  );
}
