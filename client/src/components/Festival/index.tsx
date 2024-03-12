import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { LoginModalDispatchContext } from "../../contexts/LoginModalContext";
import { PickItemsContext } from "../../contexts/PickItemsContext";
import { UserContext } from "../../contexts/userContext";
import { Container, Img, Section, Status } from "./styled";
import { NoImage, HeartIcon, EmptyHeartIcon } from "../../assets";
import "../../styles/common.scss";

type FestivalProps = {
  festival: FestivalItem;
};

export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month: string | number = today.getMonth() + 1;
  let day: string | number = today.getDate();

  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  return Number(`${year}${month}${day}`);
}
function getStatus(
  today: number,
  startDate: number,
  endDate: number
): [string, string] {
  const statusMap = {
    scheduled: "예정",
    completed: "종료",
    inProgress: "진행중",
  };

  const entries = Object.entries(statusMap);

  // 순서 중요
  if (startDate > today) {
    // 예정
    return entries[0];
  }
  if (today > endDate) {
    return entries[1];
  }
  return entries[2];
}

const Festival = ({ festival }: FestivalProps) => {
  const {
    authState: { loginStatus },
  } = useContext(UserContext);
  const setIsLoginModal = useContext(LoginModalDispatchContext);
  const { pickItems, togglePick } = useContext(PickItemsContext);
  const { festivalId, title, imageUrl, startDate, endDate, location } =
    festival;
  const [like, setLike] = useState(false);
  const navigate = useNavigate();

  const onErrorImg = (e: React.ChangeEvent<HTMLImageElement>) => {
    e.target.src = NoImage;
  };
  const onClickMoveDVP = (festivalId: number) => {
    navigate(`/Detail/${festivalId}`);
  };
  const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (loginStatus) {
      togglePick(festival);
      setLike((prevLike) => !prevLike);
    } else {
      setIsLoginModal(true);
    }
  };
  const today = getCurrentDate();
  const [statusKey, statusText] = getStatus(today, startDate, endDate);

  useEffect(() => {
    if (loginStatus) {
      const isPicked = pickItems.some((pick) => pick.festivalId === festivalId);
      if (isPicked) {
        setLike(true);
      } else {
        like && setLike(false);
      }
    }
  }, [pickItems, loginStatus]);

  return (
    <Container
      data-testid="Festival"
      key={festivalId}
      onClick={() => onClickMoveDVP(festivalId)}
    >
      <Status status={statusKey}>{statusText}</Status>
      <Img
        src={imageUrl}
        data-testid="thumbnail"
        alt={title}
        onError={onErrorImg}
      />
      <Section>
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
        <button onClick={onClickHandler}>
          <img alt="heart" src={like ? HeartIcon : EmptyHeartIcon} />
        </button>
      </Section>
    </Container>
  );
};

export default Festival;
