import React, { useContext, useEffect, useState, useCallback } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { LoginModalContext } from "../../contexts/LoginModalContext";
import { UserContext } from "../../contexts/userContext";
import { Container, Status } from "./styled";
import HeartImg from "../../assets/heart.png";
import onErrorImage from "../../assets/noimage.png";
import EmptyHeartImg from "../../assets/empty-heart.png";
import "../../styles/common.scss";

type FestivalProps = {
  festival: FestivalItem;
  togglePick: togglePick;
  pickItems: FestivalItem[];
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

const Festival = ({ festival, togglePick, pickItems }: FestivalProps) => {
  const {
    authState: { loginStatus },
  } = useContext(UserContext);
  const { setIsLoginModal } = useContext(LoginModalContext);
  const { festivalId, title, imageUrl, startDate, endDate, location } =
    festival;
  const [like, setLike] = useState(
    pickItems.some((pick) => pick.festivalId === festivalId)
  );
  let navigate = useNavigate();

  const onErrorImg = (e: React.ChangeEvent<HTMLImageElement>) => {
    e.target.src = onErrorImage;
  };

  const onClickMoveDVP = (festivalId: number) => {
    navigate(`/Detail/${festivalId}`);
  };

  const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log("heart clicked!!!!!!!", loginStatus);

    if (loginStatus) {
      togglePick(festival);
      setLike((prevLike) => !prevLike);
    } else {
      setIsLoginModal(true);
    }

    /**
     * 로그인 되어 있으면 찜, 로그인 안되어 있으면 로그인 모달
     */
  };
  const today = getCurrentDate();

  const getStatus = (
    today: number,
    startDate: number,
    endDate: number
  ): [string, string] => {
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
  };

  const [statusKey, statusText] = getStatus(today, startDate, endDate);

  // useEffect(() => {
  //   const isPicked = pickItems.some((ele) => ele.festivalId === festivalId);
  //   setLike(isPicked);
  // }, [pickItems, festivalId]);

  return (
    <Container
      data-testid="Festival"
      key={festivalId}
      onClick={() => onClickMoveDVP(festivalId)}
    >
      <Status status={statusKey}>{statusText}</Status>
      <img
        src={`${imageUrl}?w=400&h=400&fit=crop` || onErrorImage}
        alt={title}
        onError={onErrorImg}
      />
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
        <button onClick={onClickHandler}>
          <img alt="heart" src={like ? HeartImg : EmptyHeartImg} />
        </button>
      </section>
    </Container>
  );
};

export default Festival;
