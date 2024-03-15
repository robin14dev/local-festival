import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { NoImage, HeartIcon, EmptyHeartIcon } from "assets";
import moment from "moment";

import { Container } from "./Festival/styled";

type PickProps = {
  festival: FestivalItem;

  togglePick: (festival: FestivalItem) => void;
};

const FestivalWrapper = styled(Container)``;
const Pick = ({ festival, togglePick }: PickProps) => {
  const [like] = useState(true);

  let navigate = useNavigate();
  const { festivalId, title, imageUrl, startDate, endDate, location } =
    festival;
  const onClickRemove = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: FestivalItem,
  ) => {
    e.stopPropagation();
    togglePick(item);
  };
  const onErrorImg = (e: React.ChangeEvent<HTMLImageElement>) => {
    e.target.src = NoImage;
  };

  const onClickMoveDVP = () => {
    navigate(`/Detail/${festivalId}`);
  };
  return (
    <FestivalWrapper onClick={onClickMoveDVP}>
      <img src={imageUrl || NoImage} alt={title} onError={onErrorImg} />
      <section>
        <div>
          <h1>{title}</h1>
          <ul>
            <li>{location}</li>
            <li>
              {moment(startDate, "YYYY.MM.DD").format("YYYY.MM.DD")} ~{" "}
              {moment(endDate, "YYYY.MM.DD").format("YYYY.MM.DD")}
            </li>
          </ul>
        </div>
        <button
          onClick={(e) => {
            onClickRemove(e, festival);
          }}
        >
          <img alt="heart" src={like ? HeartIcon : EmptyHeartIcon} />
        </button>
      </section>
    </FestivalWrapper>
  );
};

export default Pick;
