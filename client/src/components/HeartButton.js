import React from 'react';

import styled from 'styled-components';
import HeartImg from '../assets/heart.png';
import EmptyHeartImg from '../assets/empty-heart.png';

const Heart = styled.img`
  /* height: 2rem;
  width: auto; */
`;

const HeartButton = ({ like, onClick }) => {
  return <Heart src={like ? HeartImg : EmptyHeartImg} onClick={onClick} />;
};

export default HeartButton;
