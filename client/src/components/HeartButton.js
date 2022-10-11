import React from 'react';

import styled from 'styled-components';
import HeartImg from '../assets/heart.png';
import EmptyHeartImg from '../assets/empty-heart.png';

const HeartButton = ({ like, onClick }) => {
  return (
    <button onClick={onClick}>
      <img alt="heart" src={like ? HeartImg : EmptyHeartImg} />
    </button>
  );
};

export default HeartButton;
