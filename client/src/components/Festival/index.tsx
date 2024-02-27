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

const Festival = ({ festival, togglePick, pickItems }: FestivalProps) => {
  const userContext = useContext(UserContext);
  const { setIsLoginModal } = useContext(LoginModalContext);
  const { festivalId, title, imageUrl, startDate, endDate, location } =
    festival;
  const [like, setLike] = useState(false);
  let navigate = useNavigate();

  const onErrorImg = (e: React.ChangeEvent<HTMLImageElement>) => {
    e.target.src = onErrorImage;
  };

  const onClickMoveDVP = (festivalId: number) => {
    navigate(`/Detail/${festivalId}`);
  };
  const toggleLike = () => {
    setLike(!like);
  };

  const onClickPick = (
    e: React.MouseEvent<HTMLButtonElement>,
    festival: FestivalItem
  ) => {
    e.stopPropagation();
    togglePick(festival);
    toggleLike();
  };

  const todayFunc = useCallback((): number => {
    let now = new Date();
    let year = now.getFullYear().toString();
    let month = now.getMonth() + 1;
    let convertMonth;
    let convertDate;
    let date = now.getDate();

    if (month < 10) {
      convertMonth = "0" + month;
    } else {
      convertMonth = month;
    }
    if (date < 10) {
      convertDate = "0" + date;
    } else {
      convertDate = date;
    }

    return Number(year + convertMonth + convertDate);
  }, []);

  const showStatus = useCallback((startDate: number, endDate: number) => {
    const status = {
      scheduled: "예정",
      completed: "종료",
      inProgress: "진행중",
    };

    const today = todayFunc();

    // 순서 중요
    if (today < startDate) {
      // 예정
      return Object.entries(status)[0];
    }
    if (today > endDate) {
      return Object.entries(status)[1];
    }
    return Object.entries(status)[2];
  }, []);

  useEffect(() => {
    const isPicked = pickItems.some((ele) => ele.festivalId === festivalId);
    setLike(isPicked);
  }, [pickItems, festivalId]);

  return (
    <Container
      key={festivalId}
      onClick={() => {
        onClickMoveDVP(festivalId);
      }}
    >
      <Status status={showStatus(startDate, endDate)[0]}>
        {showStatus(startDate, endDate)[1]}
      </Status>
      <img
        src={`${imageUrl}?w=400&h=400&fit=crop` || onErrorImage}
        alt={`${title} : 이미지가 존재하지 않습니다`}
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
        <button
          onClick={(e) => {
            if (userContext) {
              if (userContext.authState.loginStatus) {
                onClickPick(e, festival);
              } else {
                e.stopPropagation();
                setIsLoginModal(true);
              }
            }
          }}
        >
          <img alt="heart" src={like ? HeartImg : EmptyHeartImg} />
        </button>
      </section>
    </Container>
  );
};

export default Festival;
