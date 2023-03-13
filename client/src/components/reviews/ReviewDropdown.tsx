import React from 'react';
import Dropdown from '../utilities/Dropdown';
import { ReactComponent as Edit } from '../../assets/edit.svg';
import { ReactComponent as Delete } from '../../assets/delete.svg';
type ReviewDropdownProps = {
  setEditItem: React.Dispatch<React.SetStateAction<EditItem>>;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  info: TReviewItem;
};

export default function ReviewDropdown({
  setEditItem,
  setIsDelete,
  info,
}: ReviewDropdownProps) {
  return (
    <Dropdown>
      <li
        onClick={() => {
          setEditItem((prev) => ({
            ...prev,
            isEdit: true,
            info,
          }));
        }}
      >
        <Edit /> 수정하기
      </li>
      <li onClick={() => setIsDelete(true)}>
        <Delete />
        삭제하기
      </li>
    </Dropdown>
  );
}
